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

// In production, use fallback (no backend available without Blaze plan)
// In development, use local backend
const API_BASE_URL = isDevelopment 
  ? normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || ""
  : null; // No backend in production

const EMAIL_ENDPOINT = isDevelopment 
  ? `${API_BASE_URL}/api/send-email`
  : null; // No endpoint in production

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    // In production, don't try to send email - just show success and redirect to WhatsApp
    if (!isDevelopment || !EMAIL_ENDPOINT) {
      console.log("Produção: Redirecionando para WhatsApp", formData);
      
      // Create WhatsApp message
      const { nome, telefone, roteiro, mensagem } = formData;
      const routeLabels: Record<string, string> = {
        sacoMamangua: "Saco do Mamanguá",
        ilhaPelado: "Ilha do Pelado", 
        ilhaCedro: "Ilha do Cedro",
        ilhaMalvao: "Ilha Malvão",
        praiaVentura: "Praia Ventura",
        praiaSobrado: "Praia do Sobrado",
        praiaEngenho: "Praia do Engenho",
        praiaCrepusculo: "Praia do Crepúsculo",
        outro: "Outro",
      };
      
      const roteiroNome = routeLabels[roteiro] || roteiro;
      const whatsappMessage = `🛥️ *ParatyBoat - Solicitação de Contato*%0A%0A*Nome:* ${nome}%0A*Telefone:* ${telefone}%0A*Roteiro:* ${roteiroNome}%0A*Mensagem:* ${mensagem}`;
      
      // Open WhatsApp in a new tab (don't redirect current page)
      const whatsappUrl = `https://wa.me/5511982448956?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
      
      return {
        success: true,
        data: { message: "Redirecionado para WhatsApp" },
      };
    }

    // Development mode - use local backend
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