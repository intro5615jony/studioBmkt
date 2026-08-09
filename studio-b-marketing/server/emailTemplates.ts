export interface EmailTemplateParams {
  firstName: string;
  actionUrl: string;
  logoUrl?: string;
}

export function generateInviteEmailHtml({ firstName, actionUrl, logoUrl }: EmailTemplateParams): string {
  const logo = logoUrl || 'https://studiobmkt.com.br/logo.png';
  const cleanFirstName = firstName && firstName.trim() ? firstName.trim() : 'Usuário';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu acesso ao Studio B Marketing está pronto</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3EDE0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #43210D;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F3EDE0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- CARD CONTAINER -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #CE892C; border-opacity: 0.3; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(67, 33, 13, 0.08);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="padding: 36px 32px 24px 32px; background-color: #43210D; text-align: center;">
              <img src="${logo}" alt="Studio B Marketing" style="max-height: 44px; width: auto; display: block; margin: 0 auto; border: 0;" onerror="this.style.display='none'; document.getElementById('fallback-logo-text').style.display='block';" />
              <div id="fallback-logo-text" style="display: none; color: #FFC400; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                STUDIO <span style="color: #E17541;">B</span> MARKETING
              </div>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 36px 32px; color: #43210D; font-size: 15px; line-height: 1.6;">
              <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 800; color: #43210D; letter-spacing: -0.02em;">
                Olá, ${cleanFirstName}!
              </h1>

              <p style="margin: 0 0 16px 0; color: #43210D; font-weight: 500;">
                Você recebeu acesso ao painel administrativo do <strong>Studio B Marketing</strong>.
              </p>

              <p style="margin: 0 0 28px 0; color: #43210D; font-weight: 500;">
                Para concluir seu cadastro e acessar a plataforma, basta criar sua senha através do botão abaixo.
              </p>

              <!-- CTA BUTTON -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${actionUrl}" target="_blank" style="background-color: #FFC400; color: #43210D; font-size: 14px; font-weight: 800; text-decoration: none; padding: 16px 36px; border-radius: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #CE892C;">
                      CRIAR MINHA SENHA
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 13px; color: #665544; line-height: 1.5;">
                Por segurança, este link possui prazo de validade. Caso ele expire, você poderá solicitar um novo acesso.
              </p>

              <p style="margin: 0 0 28px 0; font-size: 13px; color: #665544; line-height: 1.5;">
                Após criar sua senha, você poderá entrar no painel utilizando seu e-mail e a senha cadastrada.
              </p>

              <!-- SIGNATURE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-t: 1px solid #EFE8DA; padding-top: 20px; margin-top: 28px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; font-weight: 800; color: #43210D;">Studio B Marketing</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; font-style: italic; color: #E17541; font-weight: 600;">Criatividade, estratégia e tecnologia.</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 28px 0 0 0; font-size: 11px; color: #887766; line-height: 1.4;">
                Caso você não reconheça este convite, desconsidere este e-mail.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding: 20px 32px; background-color: #F8F5EE; border-top: 1px solid #EFE8DA; font-size: 11px; color: #887766;">
              © 2026 Studio B Marketing • Todos os direitos reservados
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateResetPasswordEmailHtml({ firstName, actionUrl, logoUrl }: EmailTemplateParams): string {
  const logo = logoUrl || 'https://studiobmkt.com.br/logo.png';
  const cleanFirstName = firstName && firstName.trim() ? firstName.trim() : 'Usuário';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de senha | Studio B Marketing</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3EDE0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #43210D;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F3EDE0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- CARD CONTAINER -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #CE892C; border-opacity: 0.3; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(67, 33, 13, 0.08);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td align="center" style="padding: 36px 32px 24px 32px; background-color: #43210D; text-align: center;">
              <img src="${logo}" alt="Studio B Marketing" style="max-height: 44px; width: auto; display: block; margin: 0 auto; border: 0;" onerror="this.style.display='none'; document.getElementById('fallback-logo-text').style.display='block';" />
              <div id="fallback-logo-text" style="display: none; color: #FFC400; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                STUDIO <span style="color: #E17541;">B</span> MARKETING
              </div>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 36px 32px; color: #43210D; font-size: 15px; line-height: 1.6;">
              <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 800; color: #43210D; letter-spacing: -0.02em;">
                Olá, ${cleanFirstName}!
              </h1>

              <p style="margin: 0 0 16px 0; color: #43210D; font-weight: 500;">
                Recebemos uma solicitação para redefinir a senha do seu acesso ao painel do <strong>Studio B Marketing</strong>.
              </p>

              <p style="margin: 0 0 28px 0; color: #43210D; font-weight: 500;">
                Clique no botão abaixo para criar uma nova senha:
              </p>

              <!-- CTA BUTTON -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${actionUrl}" target="_blank" style="background-color: #FFC400; color: #43210D; font-size: 14px; font-weight: 800; text-decoration: none; padding: 16px 36px; border-radius: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #CE892C;">
                      REDEFINIR MINHA SENHA
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 13px; color: #665544; line-height: 1.5;">
                Por segurança, este link possui prazo de validade.
              </p>

              <p style="margin: 0 0 28px 0; font-size: 13px; color: #665544; line-height: 1.5;">
                Se você não solicitou a alteração da sua senha, pode ignorar este e-mail. Sua senha atual continuará funcionando normalmente.
              </p>

              <!-- SIGNATURE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-t: 1px solid #EFE8DA; padding-top: 20px; margin-top: 28px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; font-weight: 800; color: #43210D;">Studio B Marketing</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; font-style: italic; color: #E17541; font-weight: 600;">Criatividade, estratégia e tecnologia.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding: 20px 32px; background-color: #F8F5EE; border-top: 1px solid #EFE8DA; font-size: 11px; color: #887766;">
              © 2026 Studio B Marketing • Todos os direitos reservados
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
