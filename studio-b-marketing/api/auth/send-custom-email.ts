import dotenv from "dotenv";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { sendAuthEmail } from "../../server/emailService.js";

dotenv.config();

function getAdminAuth() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Check JSON service account fallback if individual env vars are not set
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_CREDENTIALS;

    if (!projectId || !clientEmail || !privateKey) {
      if (serviceAccountEnv) {
        try {
          const parsed = JSON.parse(serviceAccountEnv);
          initializeApp({
            credential: cert(parsed),
          });
          return { auth: getAuth() };
        } catch (e) {
          console.error("[FIREBASE ADMIN] Erro ao analisar FIREBASE_SERVICE_ACCOUNT:", e);
        }
      }
      return {
        error: "Configuração do Firebase Admin incompleta no servidor (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e/ou FIREBASE_PRIVATE_KEY ausentes)."
      };
    }

    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } catch (e: any) {
      console.error("[FIREBASE ADMIN] Erro ao inicializar Firebase Admin SDK:", e);
      return { error: "Erro ao inicializar Firebase Admin SDK." };
    }
  }

  return { auth: getAuth() };
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

  const adminAuthResult = getAdminAuth();
  if (adminAuthResult.error) {
    console.warn("[FIREBASE ADMIN]", adminAuthResult.error);
  }

  const auth = adminAuthResult.auth;
  let generatedLink = '';
  let authUid: string | null = null;

  // 1. Ensure user exists in Firebase Auth before link generation
  if (auth) {
    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(cleanEmail);
      } catch (getUserErr: any) {
        if (getUserErr.code === 'auth/user-not-found') {
          console.log(`[FIREBASE ADMIN] Creating user in Auth: ${cleanEmail}`);
          const tempPassword = `StudioB!${Math.random().toString(36).substring(2, 10)}${Math.floor(Math.random() * 1000)}`;
          userRecord = await auth.createUser({
            email: cleanEmail,
            password: tempPassword,
            displayName: firstName || cleanEmail.split('@')[0],
          });
        }
      }

      if (userRecord) {
        authUid = userRecord.uid;
      }

      // 2. Generate official reset link via Firebase Admin SDK
      generatedLink = await auth.generatePasswordResetLink(cleanEmail, actionCodeSettings);
      console.log(`[FIREBASE ADMIN] Link oficial gerado com sucesso via Firebase Admin SDK para ${cleanEmail}`);
    } catch (adminErr: any) {
      console.warn("[FIREBASE ADMIN] Exceção ao gerar link via Admin SDK:", adminErr.message || adminErr);
    }
  }

  // Fallback to REST API if Admin SDK was unable to generate the link
  if (!generatedLink) {
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
        const signUpRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: tempPassword,
            returnSecureToken: true
          })
        });
        const signUpData = await signUpRes.json();
        if (signUpData?.localId) {
          authUid = signUpData.localId;
        }

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
        generatedLink = fbData.oobLink;
      }
    } catch (fallbackErr) {
      console.error("[FIREBASE API] Exceção no envio do oobCode via REST API:", fallbackErr);
    }
  }

  if (!generatedLink) {
    return res.status(500).json({
      success: false,
      error: 'Não foi possível gerar o link de acesso no Firebase Auth. Verifique se as variáveis de ambiente FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY estão configuradas na Vercel.'
    });
  }

  // 3. Transform generated Firebase action link into application URL
  let finalActionUrl = '';
  try {
    const parsedUrl = new URL(generatedLink);
    const oobCode = parsedUrl.searchParams.get('oobCode');
    const mode = parsedUrl.searchParams.get('mode') || 'resetPassword';
    const apiKey = parsedUrl.searchParams.get('apiKey');
    const continueUrl = parsedUrl.searchParams.get('continueUrl') || `${baseUrl}/admin/definir-senha`;
    const lang = parsedUrl.searchParams.get('lang');

    if (!oobCode) {
      console.error('[FIREBASE ADMIN] Falha: oobCode ausente no link gerado pelo Firebase:', generatedLink);
      return res.status(500).json({
        success: false,
        error: 'Erro na geração do link de redefinição: oobCode ausente.'
      });
    }

    const targetUrl = new URL(`${baseUrl}/admin/definir-senha`);
    targetUrl.searchParams.set('mode', mode);
    targetUrl.searchParams.set('oobCode', oobCode);
    if (apiKey) targetUrl.searchParams.set('apiKey', apiKey);
    targetUrl.searchParams.set('continueUrl', continueUrl);
    if (lang) targetUrl.searchParams.set('lang', lang);

    finalActionUrl = targetUrl.toString();
  } catch (urlErr) {
    console.error('[FIREBASE ADMIN] Erro ao reescrever URL do Firebase:', urlErr);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar URL de acesso para a aplicação.'
    });
  }

  // 4. Dispatch email with finalActionUrl via SMTP
  const result = await sendAuthEmail({
    type: type === 'invite' ? 'invite' : 'reset_password',
    to: cleanEmail,
    firstName: firstName || cleanEmail.split('@')[0],
    actionUrl: finalActionUrl,
    origin: baseUrl,
  });

  return res.status(200).json({
    ...result,
    uid: authUid,
    email: cleanEmail,
  });
}
