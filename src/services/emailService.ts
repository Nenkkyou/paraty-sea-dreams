export interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  roteiro: string;
  mensagem: string;
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

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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