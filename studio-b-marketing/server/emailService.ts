import nodemailer from 'nodemailer';
import { generateInviteEmailHtml, generateResetPasswordEmailHtml } from './emailTemplates.js';

export interface SendAuthEmailOptions {
  type: 'invite' | 'reset_password';
  to: string;
  firstName?: string;
  actionUrl: string;
  origin?: string;
}

export async function sendAuthEmail(options: SendAuthEmailOptions) {
  const { type, to, firstName = '', actionUrl, origin } = options;

  const senderName = 'Studio B Marketing';
  const senderEmail = process.env.SMTP_USER || 'contato@studiobmkt.com.br';
  const fromAddress = process.env.SMTP_FROM || `"${senderName}" <${senderEmail}>`;

  const logoUrl = origin ? `${origin}/logo.png` : 'https://studiobmkt.com.br/logo.png';

  const subject = type === 'invite'
    ? 'Seu acesso ao Studio B Marketing está pronto'
    : 'Redefinição de senha | Studio B Marketing';

  const htmlContent = type === 'invite'
    ? generateInviteEmailHtml({ firstName, actionUrl, logoUrl })
    : generateResetPasswordEmailHtml({ firstName, actionUrl, logoUrl });

  const textContent = type === 'invite'
    ? `Olá, ${firstName || 'Usuário'}!\n\nVocê recebeu acesso ao painel administrativo do Studio B Marketing.\n\nPara concluir seu cadastro e acessar a plataforma, crie sua senha acessando o link abaixo:\n${actionUrl}\n\nPor segurança, este link possui prazo de validade.\n\nStudio B Marketing\nCriatividade, estratégia e tecnologia.`
    : `Olá, ${firstName || 'Usuário'}!\n\nRecebemos uma solicitação para redefinir a senha do seu acesso ao painel do Studio B Marketing.\n\nAcesse o link abaixo para criar uma nova senha:\n${actionUrl}\n\nPor segurança, este link possui prazo de validade.\n\nStudio B Marketing\nCriatividade, estratégia e tecnologia.`;

  // 1. Check for SMTP configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[EMAIL SERVICE] E-mail enviado com sucesso via SMTP para ${to}. ID: ${info.messageId}`);
      return {
        success: true,
        sent: true,
        provider: 'SMTP',
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error('[EMAIL SERVICE] Erro ao enviar e-mail via SMTP:', err);
      // Fallback response with error details
      return {
        success: false,
        sent: false,
        error: err.message || 'Erro ao enviar e-mail via servidor SMTP.',
      };
    }
  }

  // 2. Check for Resend API Key if present
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (resendRes.ok) {
        const data = await resendRes.json();
        console.log(`[EMAIL SERVICE] E-mail enviado com sucesso via Resend API para ${to}. ID: ${data.id}`);
        return {
          success: true,
          sent: true,
          provider: 'Resend',
          messageId: data.id,
        };
      } else {
        const errText = await resendRes.text();
        console.error('[EMAIL SERVICE] Erro Resend API:', errText);
      }
    } catch (err: any) {
      console.error('[EMAIL SERVICE] Exceção ao enviar via Resend API:', err);
    }
  }

  // 3. Fallback / Log mode if no SMTP credentials configured yet
  console.log(`[EMAIL SERVICE] [PREVIEW/FALLBACK MODE] E-mail do Studio B Marketing gerado para ${to}`);
  console.log(`[EMAIL SERVICE] Assunto: ${subject}`);
  console.log(`[EMAIL SERVICE] Remetente: ${fromAddress}`);
  console.log(`[EMAIL SERVICE] Link da Ação: ${actionUrl}`);

  return {
    success: true,
    sent: false,
    mode: 'preview_only',
    message: 'Servidor SMTP ou Resend API não configurados no arquivo .env. Para enviar e-mails reais, adicione as credenciais do domínio studiobmkt.com.br.',
    actionUrl,
  };
}
