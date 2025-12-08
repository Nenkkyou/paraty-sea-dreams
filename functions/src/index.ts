/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {Resend} from "resend";
import cors from "cors";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Configure CORS
const corsHandler = cors({
  origin: [
    "https://paraty-boat.web.app",
    "https://paraty-boat.firebaseapp.com",
    "https://paratyboat.com.br",
    "https://www.paratyboat.com.br",
    "http://paratyboat.com.br",
    "http://www.paratyboat.com.br",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173"
  ],
  credentials: true,
});

interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  roteiro: string;
  mensagem: string;
}

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

export const sendEmail = onRequest(
  {
    cors: true,
  },
  async (request, response) => {
    return new Promise<void>((resolve) => {
      corsHandler(request, response, async () => {
        try {
          logger.info("📧 Recebida requisição para envio de email", {
            method: request.method,
            body: request.body,
          });

          if (request.method !== "POST") {
            response.status(405).json({
              success: false,
              error: "Método não permitido",
            });
            resolve();
            return;
          }

          const {nome, email, telefone, roteiro, mensagem}: ContactFormData = request.body;

          if (!nome || !email || !telefone || !roteiro || !mensagem) {
            logger.warn("❌ Dados obrigatórios ausentes");
            response.status(400).json({
              success: false,
              error: "Todos os campos são obrigatórios",
            });
            resolve();
            return;
          }

          logger.info("✅ Dados validados, enviando email...");

          // Get environment variables
          const resendApiKey = process.env.RESEND_API_KEY;
          const contactEmailAddr = process.env.CONTACT_EMAIL;

          if (!resendApiKey || !contactEmailAddr) {
            logger.error("❌ Variáveis de ambiente não configuradas");
            response.status(500).json({
              success: false,
              error: "Configuração do servidor incompleta",
            });
            resolve();
            return;
          }

          const resend = new Resend(resendApiKey);

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
                    ${new Date().toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          `;

          const emailResponse = await resend.emails.send({
            from: "ParatyBoat <onboarding@resend.dev>",
            to: [contactEmailAddr],
            replyTo: email,
            subject: `🛥️ Novo Contato - ${nome}`,
            html: htmlTemplate,
          });

          if (emailResponse.error) {
            logger.error("❌ Resend retornou erro:", emailResponse.error);
            response.status(500).json({
              success: false,
              error: emailResponse.error.message,
            });
            resolve();
            return;
          }

          const emailId = emailResponse.data?.id || "unknown";
          logger.info(`✅ Email ${emailId} enviado com sucesso para ${contactEmailAddr}`);

          response.json({
            success: true,
            message: "Email enviado com sucesso!",
            id: emailId,
          });
          resolve();
        } catch (error) {
          logger.error("❌ Erro ao enviar email:", error);
          const message = error instanceof Error ? error.message : "Erro interno do servidor";
          response.status(500).json({success: false, error: message});
          resolve();
        }
      });
    });
  }
);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/**
 * Função para enviar email de resposta a uma solicitação
 */
export const sendReplyEmail = onRequest(
  {
    cors: true,
  },
  async (request, response) => {
    return new Promise<void>((resolve) => {
      corsHandler(request, response, async () => {
        try {
          logger.info("📧 Recebida requisição para envio de resposta", {
            method: request.method,
            body: request.body,
          });

          if (request.method !== "POST") {
            response.status(405).json({
              success: false,
              error: "Método não permitido",
            });
            resolve();
            return;
          }

          const { to, subject, message } = request.body;

          if (!to || !subject || !message) {
            logger.warn("❌ Dados obrigatórios ausentes");
            response.status(400).json({
              success: false,
              error: "Destinatário, assunto e mensagem são obrigatórios",
            });
            resolve();
            return;
          }

          logger.info("✅ Dados validados, enviando resposta...");

          // Get environment variables
          const resendApiKey = process.env.RESEND_API_KEY;

          if (!resendApiKey) {
            logger.error("❌ Variáveis de ambiente não configuradas");
            response.status(500).json({
              success: false,
              error: "Configuração do servidor incompleta",
            });
            resolve();
            return;
          }

          const resend = new Resend(resendApiKey);

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

          const emailResponse = await resend.emails.send({
            from: "Paraty Boat <contato@paratyboat.com.br>",
            to: [to],
            subject: subject,
            html: htmlTemplate,
          });

          if (emailResponse.error) {
            logger.error("❌ Resend retornou erro:", emailResponse.error);
            response.status(500).json({
              success: false,
              error: emailResponse.error.message,
            });
            resolve();
            return;
          }

          const emailId = emailResponse.data?.id || "unknown";
          logger.info(`✅ Resposta ${emailId} enviada com sucesso para ${to}`);

          response.json({
            success: true,
            message: "Resposta enviada com sucesso!",
            id: emailId,
          });
          resolve();
        } catch (error) {
          logger.error("❌ Erro ao enviar resposta:", error);
          const message = error instanceof Error ? error.message : "Erro interno do servidor";
          response.status(500).json({ success: false, error: message });
          resolve();
        }
      });
    });
  }
);
