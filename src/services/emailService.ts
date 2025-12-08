export interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  roteiro: string;
  mensagem: string;
}

export interface ReplyEmailData {
  to: string;
  subject: string;
  message: string;
  fromName?: string;
}

const normalizeBaseUrl = (baseUrl?: string) => {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

// Check if we're in development or production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || ""
  : "https://us-central1-paraty-boat.cloudfunctions.net";

const EMAIL_ENDPOINT = isDevelopment 
  ? `${API_BASE_URL}/api/send-email`
  : `${API_BASE_URL}/sendEmail`;

// Email destinatário das solicitações de contato
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "cdantasneto@gmail.com";

// Resend API Key
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || "";

/**
 * Enviar email de resposta diretamente via Resend API
 */
export const sendReplyEmail = async (data: ReplyEmailData): Promise<{ success: boolean; error?: string }> => {
  // Usar a API key do ambiente
  const apiKey = RESEND_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: "API Key do Resend não configurada"
    };
  }
  
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Paraty Boat <onboarding@resend.dev>`,
        to: [data.to],
        subject: data.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0a3d62, #1e8449); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">⛵ Paraty Boat</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
            </div>
            <div style="padding: 20px; text-align: center; background: #0a3d62; color: white;">
              <p style="margin: 0; font-size: 14px;">Paraty Boat - Passeios de Lancha em Paraty</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">📞 WhatsApp: (11) 98244-8956</p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro Resend:", errorData);
      return {
        success: false,
        error: errorData?.message || `Erro ao enviar email (${response.status})`
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro de conexão"
    };
  }
};

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        to: CONTACT_EMAIL,
      }),
    });

    const payload = await response.json().catch(() => ({ success: false }));

    if (!response.ok || !payload?.success) {
      const errorMessage = payload?.error || `Erro ao enviar email (HTTP ${response.status})`;
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: payload,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar email",
    };
  }
};