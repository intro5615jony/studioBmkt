import dotenv from "dotenv";
import { sendAuthEmail } from "../../server/emailService.js";

dotenv.config();

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

  const { type, email, firstName, actionUrl } = req.body || {};

  if (!email || !type) {
    return res.status(400).json({ success: false, error: 'E-mail e tipo de mensagem são obrigatórios.' });
  }

  const baseUrl = resolveBaseAppUrl(req);
  let finalActionUrl = actionUrl;

  if (finalActionUrl && typeof finalActionUrl === 'string') {
    finalActionUrl = finalActionUrl.replace(/http:\/\/localhost:\d+/g, baseUrl)
                                   .replace(/http:\/\/127\.0\.0\.1:\d+/g, baseUrl)
                                   .replace(/https:\/\/localhost:\d+/g, baseUrl);
  }

  if (!finalActionUrl) {
    try {
      const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyCeMNtT4vo3-njJJiFLT2oCuXVFx1ZATng";
      const continueUrl = `${baseUrl}/admin/definir-senha`;
      
      let fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email,
          continueUrl: continueUrl
        })
      });

      let fbData = await fbRes.json();

      if (!fbRes.ok && fbData.error?.message?.includes('EMAIL_NOT_FOUND')) {
        console.log(`[VERCEL API] Provisioning new Firebase Auth account for invite: ${email}`);
        const tempPassword = `StudioB!${Math.random().toString(36).substring(2, 10)}${Math.floor(Math.random() * 1000)}`;
        
        await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: tempPassword,
            returnSecureToken: true
          })
        });

        fbRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email: email,
            continueUrl: continueUrl
          })
        });
        fbData = await fbRes.json();
      }

      if (fbRes.ok && fbData.oobLink) {
        const rawOobLink = fbData.oobLink as string;
        const oobCodeMatch = rawOobLink.match(/[?&]oobCode=([^&]+)/);
        const oobCode = oobCodeMatch ? oobCodeMatch[1] : null;

        if (oobCode) {
          finalActionUrl = `${baseUrl}/admin/definir-senha?oobCode=${oobCode}&mode=resetPassword`;
        } else {
          finalActionUrl = rawOobLink.replace(/http:\/\/localhost:\d+/g, baseUrl)
                                     .replace(/http:\/\/127\.0\.0\.1:\d+/g, baseUrl);
        }
      } else {
        console.warn("[VERCEL API] Firebase sendOobCode response notice:", fbData);
        finalActionUrl = `${baseUrl}/admin/definir-senha`;
      }
    } catch (err) {
      console.warn("[VERCEL API] Could not retrieve oobLink directly from Firebase:", err);
      finalActionUrl = `${baseUrl}/admin/definir-senha`;
    }
  }

  const result = await sendAuthEmail({
    type: type === 'invite' ? 'invite' : 'reset_password',
    to: email,
    firstName: firstName || email.split('@')[0],
    actionUrl: finalActionUrl,
    origin: baseUrl,
  });

  return res.status(200).json(result);
}
