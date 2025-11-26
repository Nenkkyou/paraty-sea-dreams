@echo off
echo 🚀 Iniciando ParatyBoat - Frontend + Backend
echo.

echo 📧 Iniciando API Backend (porta 3001)...
cd api
start cmd /k "node server.js"

echo.
echo 🌐 Iniciando Frontend (porta 8080)...
cd ..
start cmd /k "npm run dev"

echo.
echo ✅ Ambos os servidores foram iniciados!
echo 📧 API Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:8080/contato
echo.
pause