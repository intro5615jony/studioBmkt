import dotenv from "dotenv";
import admin from "firebase-admin";
import { sendAuthEmail } from "../../server/emailService.js";

dotenv.config();

// Initialize Firebase Admin SDK if not initialized
if (!admin.apps.length) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_CREDENTIALS;
  if (serviceAccountEnv) {
    try {
      const parsed = JSON.parse(serviceAccountEnv);
      admin.initializeApp({
        credential: admin.credential.cert(parsed),
        projectId: parsed.project_id || "gen-lang-client-0440968965",
      });
    } catch (e) {
      console.warn("[FIREBASE ADMIN] Could not parse service account JSON, initializing default:", e);
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0440968965",
      });
    }
  } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0440968965",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0440968965",
    });
  }
}

function resolveBaseAppUrl(req: any): string {
  const envUrl = process.env.APP_URL || process.env.VITE_APP_URL;
  if (envUrl && envUrl.trim() && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.trim().replace(/\/$/, '');
  }
  if (req) {
    const headers = req.headers || {};
    const forwardedHost = headers['x-forwarded-host'] || headers['host'] || '';
    const protocol = headers['x-forwarded-proto'] || 'https';
    if (forwardedHost && !forwardedHost.includes('localhost') && !forwardedHost.includes('127.0.0.1')) {
      return `${protocol}://${forwardedHost}`.replace(/\/$/, '');
    }
  }
  return 'https://studio-bmkt.vercel.app';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  const { type, email, firstName } = req.body || {};

  if (!email || !type) {
    return res.status(400).json({ success: false, error: 'E-mail e tipo de mensagem são obrigatórios.' });
  }

  const cleanEmail = email.trim();
  const baseUrl = resolveBaseAppUrl(req);
  const actionCodeSettings = {
    url: `${baseUrl}/admin/definir-senha`,
    handleCodeInApp: true,
  };

  let generatedLink = '';

  // 1. Ensure user exists in Firebase Auth before link generation
  try {
    try {
      await admin.auth().getUserByEmail(cleanEmail);
    } catch (getUserErr: any) {
      if (getUserErr.code === 'auth/user-not-found') {
        console.log(`[FIREBASE ADMIN] Creating user in Auth: ${cleanEmail}`);
        const tempPassword = `StudioB!${Math.random().toString(36).substring(2, 10)}${Math.floor(Math.random() * 1000)}`;
        await admin.auth().createUser({
          email: cleanEmail,
          password: tempPassword,
          displayName: firstName || cleanEmail.split('@')[0],
        });
      }
    }

    // 2. Generate official reset link via Firebase Admin SDK
    generatedLink = await admin.auth().generatePasswordResetLink(cleanEmail, actionCodeSettings);
    console.log(`[FIREBASE ADMIN] Link oficial gerado com sucesso via Firebase Admin SDK para ${cleanEmail}`);
  } catch (adminErr: any) {
    console.warn("[FIREBASE ADMIN] Falha no Admin SDK, tentando REST API:", adminErr.message || adminErr);
    
    // Fallback using Firebase Identity Toolkit REST API
    try {
      const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyCeMNtT4vo3-njJJiFLT2oCuXVFx1ZATng";
      let fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: cleanEmail,
          continueUrl: `${baseUrl}/admin/definir-senha`
        })
      });

      let fbData = await fbRes.json();

      if (!fbRes.ok && fbData.error?.message?.includes('EMAIL_NOT_FOUND')) {
        const tempPassword = `StudioB!${Math.random().toString(36).substring(2, 10)}${Math.floor(Math.random() * 1000)}`;
        await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: tempPassword,
            returnSecureToken: true
          })
        });

        fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email: cleanEmail,
            continueUrl: `${baseUrl}/admin/definir-senha`
          })
        });
        fbData = await fbRes.json();
      }

      if (fbRes.ok && fbData.oobLink) {
        // Use the EXACT official oobLink without altering or stripping parameters
        generatedLink = fbData.oobLink;
      }
    } catch (fallbackErr) {
      console.error("[FIREBASE API] Exceção no envio do oobCode:", fallbackErr);
    }
  }

  if (!generatedLink) {
    return res.status(500).json({
      success: false,
      error: 'Não foi possível gerar o link de acesso no Firebase Auth.'
    });
  }

  // 3. Dispatch email with the complete official Firebase link via SMTP
  const result = await sendAuthEmail({
    type: type === 'invite' ? 'invite' : 'reset_password',
    to: cleanEmail,
    firstName: firstName || cleanEmail.split('@')[0],
    actionUrl: generatedLink,
    origin: baseUrl,
  });

  return res.status(200).json(result);
}

