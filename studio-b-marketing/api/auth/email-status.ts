import dotenv from "dotenv";

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
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const resendKey = process.env.RESEND_API_KEY;

  const isSmtpConfigured = !!(smtpHost && smtpUser && smtpPass);
  const isResendConfigured = !!resendKey;

  return res.status(200).json({
    configured: isSmtpConfigured || isResendConfigured,
    provider: isSmtpConfigured ? 'SMTP' : isResendConfigured ? 'Resend' : 'Nenhum',
    senderEmail: process.env.SMTP_USER || 'contato@studiobmkt.com.br',
    senderName: 'Studio B Marketing',
    smtpHost: smtpHost || null,
    appUrl: resolveBaseAppUrl(req),
  });
}
