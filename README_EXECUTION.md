# ParatyBoat - Como executar o projeto

## 🚀 Executar Frontend + Backend

### Opção 1: Terminais separados (RECOMENDADO)

**Terminal 1 - API Backend:**
```bash
cd api
node server.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Opção 2: Script único (Windows)

Execute o arquivo `start.bat`:
```bash
./start.bat
```

## 📧 Sistema de Email

- **Frontend**: http://localhost:8080
- **API Backend**: http://localhost:3001
- **Resend**: Configurado e funcionando
- **Email destinatário**: contato@paratyboat.com

## ✅ Status Atual

- ✅ Textos hardcoded corrigidos no dropdown
- ✅ API backend funcionando com Resend
- ✅ Frontend conectado à API
- ✅ Emails sendo enviados corretamente

## 🧪 Testar Envio de Email

1. Acesse: http://localhost:8080/contato
2. Preencha todos os campos
3. Clique em "Enviar Mensagem"
4. Verificar no painel do Resend se o email foi enviado