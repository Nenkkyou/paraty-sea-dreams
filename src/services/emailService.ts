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

// Resend API Key (usado apenas como fallback)
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || "";

// Endpoint da Cloud Function para enviar resposta
const REPLY_EMAIL_ENDPOINT = isDevelopment
  ? `${API_BASE_URL}/api/send-reply`
  : `${API_BASE_URL}/sendReplyEmail`;

/**
 * Enviar email de resposta via Cloud Function (evita CORS)
 */
export const sendReplyEmail = async (data: ReplyEmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(REPLY_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.to,
        subject: data.subject,
        message: data.message,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Erro ao enviar resposta:", result);
      return {
        success: false,
        error: result.error || `Erro ao enviar email (${response.status})`
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