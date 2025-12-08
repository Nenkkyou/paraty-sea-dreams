import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
const port = Number(process.env.EMAIL_SERVER_PORT ?? 3001);

const allowedOrigins = (process.env.EMAIL_ALLOWED_ORIGINS ?? "http://localhost:8080,http://localhost:8081").split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} não permitido`));
    },
    credentials: true,
  })
);

app.use(express.json());

const resendApiKey = process.env.VITE_RESEND_API_KEY ?? process.env.RESEND_API_KEY;
const contactEmail = process.env.VITE_CONTACT_EMAIL ?? process.env.CONTACT_EMAIL;
const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? "ParatyBoat <onboarding@resend.dev>";

if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY não configurada. Verifique o arquivo .env");
  process.exit(1);
}

if (!contactEmail) {
  console.error("❌ Email de destino não configurado. Configure VITE_CONTACT_EMAIL no .env");
  process.exit(1);
}

const resend = new Resend(resendApiKey);

app.post("/api/send-email", async (req, res) => {
  console.log("📧 Recebida requisição para envio de email");
  console.log("Body:", req.body);

  try {
    const { nome, email, telefone, roteiro, mensagem } = req.body;

    if (!nome || !email || !telefone || !roteiro || !mensagem) {
      console.log("❌ Dados obrigatórios ausentes");
      return res.status(400).json({
        success: false,
        error: "Todos os campos são obrigatórios",
      });
    }

    console.log("✅ Dados validados, enviando email...");

    const routeLabels = {
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

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #1e40af; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🛥️ ParatyBoat</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Novo Contato Recebido</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1e40af; margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">Informações do Cliente</h2>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151; display: inline-block; width: 120px;">Nome:</strong>
            <span style="color: #111827;">${nome}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151; display: inline-block; width: 120px;">Email:</strong>
            <a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151; display: inline-block; width: 120px;">Telefone:</strong>
            <a href="tel:${telefone}" style="color: #1e40af; text-decoration: none;">${telefone}</a>
          </div>
          
          <div style="margin-bottom: 25px;">
            <strong style="color: #374151; display: inline-block; width: 120px;">Roteiro:</strong>
            <span style="color: #111827; background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${roteiroNome}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151; display: block; margin-bottom: 10px;">Mensagem:</strong>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
              <p style="margin: 0; line-height: 1.6; color: #374151;">${mensagem}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Email enviado automaticamente pelo site ParatyBoat
            </p>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">
              ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    `;
    const response = await resend.emails.send({
      from: resendFromEmail,
      to: [contactEmail],
      reply_to: email,
      subject: `🛥️ Novo Contato - ${nome}`,
      html: htmlTemplate,
    });

    if (response.error) {
      console.error("❌ Resend retornou erro:", response.error);
      return res.status(500).json({ success: false, error: response.error.message });
    }

    const emailId = response.data?.id || response.id || "unknown";
    console.log(`✅ Email ${emailId} enviado com sucesso para ${contactEmail}`);

    return res.json({ success: true, message: "Email enviado com sucesso!", id: emailId });
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    const message = error instanceof Error ? error.message : "Erro interno do servidor";
    return res.status(500).json({ success: false, error: message });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "OK", message: "API funcionando!" });
});

// Endpoint para enviar resposta a uma solicitação
app.post("/api/send-reply", async (req, res) => {
  console.log("📧 Recebida requisição para envio de resposta");
  console.log("Body:", req.body);

  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      console.log("❌ Dados obrigatórios ausentes");
      return res.status(400).json({
        success: false,
        error: "Destinatário, assunto e mensagem são obrigatórios",
      });
    }

    console.log("✅ Dados validados, enviando resposta...");

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0a3d62, #1e8449); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">⛵ Paraty Boat</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="padding: 20px; text-align: center; background: #0a3d62; color: white;">
          <p style="margin: 0; font-size: 14px;">Paraty Boat - Passeios de Lancha em Paraty</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">📞 WhatsApp: (11) 98244-8956</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: "Paraty Boat <contato@paratyboat.com.br>",
      to: [to],
      subject: subject,
      html: htmlTemplate,
    });

    if (response.error) {
      console.error("❌ Resend retornou erro:", response.error);
      return res.status(500).json({ success: false, error: response.error.message });
    }

    const emailId = response.data?.id || response.id || "unknown";
    console.log(`✅ Resposta ${emailId} enviada com sucesso para ${to}`);

    return res.json({ success: true, message: "Resposta enviada com sucesso!", id: emailId });
  } catch (error) {
    console.error("❌ Erro ao enviar resposta:", error);
    const message = error instanceof Error ? error.message : "Erro interno do servidor";
    return res.status(500).json({ success: false, error: message });
  }
});

app.listen(port, () => {
  console.log(`🚀 API rodando na porta ${port}`);
  console.log("📧 Resend configurado e pronto para enviar emails");
});

export default app;