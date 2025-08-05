@echo off
REM Script para iniciar PostgreSQL y el servidor Flask de la wallet Ecocoin en Windows

REM 1. Iniciar PostgreSQL (ajusta el nombre del servicio si es necesario)
echo [INFO] Iniciando PostgreSQL...
net start postgresql-x64-17

REM 2. Esperar unos segundos para asegurar que PostgreSQL está listo
timeout /t 2

REM 3. Establecer variables de entorno
set FLASK_APP=wallet/app.py
set FLASK_ENV=development
set PYTHONPATH=%cd%

REM 4. Liberar el puerto 5000 si está ocupado
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo [INFO] Puerto 5000 ocupado. Liberando...
    taskkill /PID %%a /F
    timeout /t 1
)

REM 5. Iniciar el servidor Flask (en segundo plano)
echo [INFO] Iniciando servidor Flask...
start cmd /k flask run --host=0.0.0.0 --port=5000

REM 6. Mensaje final
timeout /t 2
echo [INFO] Todo listo. Accede a la wallet en: http://localhost:5000/