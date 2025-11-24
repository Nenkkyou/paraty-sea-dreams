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

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const EMAIL_ENDPOINT = `${API_BASE_URL}/api/send-email`;

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