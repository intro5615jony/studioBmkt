export interface SendCustomEmailParams {
  type: 'invite' | 'reset_password';
  email: string;
  firstName?: string;
  actionUrl?: string;
}

export async function sendCustomAuthEmail(params: SendCustomEmailParams) {
  try {
    const response = await fetch('/api/auth/send-custom-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.warn('[EMAIL CLIENT] Endpoint do servidor retornou status:', response.status);
      return { success: false };
    }

    const data = await response.json();
    console.log('[EMAIL CLIENT] Resposta do envio customizado:', data);
    return data;
  } catch (err) {
    console.error('[EMAIL CLIENT] Exceção ao chamar API de e-mail customizado:', err);
    return { success: false, error: err };
  }
}
