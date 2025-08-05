#!/bin/bash
# Script para iniciar PostgreSQL y el servidor Flask de la wallet Ecocoin

# 1. Iniciar PostgreSQL (solo si no está corriendo)
echo "[INFO] Iniciando PostgreSQL..."
sudo service postgresql start

# 2. Esperar unos segundos para asegurar que PostgreSQL está listo
sleep 2

# 3. Exportar variables de entorno necesarias (ajusta según tu config)
export FLASK_APP=wallet/app.py
export FLASK_ENV=development
export PYTHONPATH=$(pwd)

# 4. Liberar el puerto 5000 si está ocupado
if sudo lsof -i:5000 | grep LISTEN; then
  echo "[INFO] Puerto 5000 ocupado. Liberando..."
  sudo fuser -k 5000/tcp
  sleep 1
fi

# 5. Iniciar el servidor Flask (en segundo plano)
echo "[INFO] Iniciando servidor Flask..."
flask run --host=0.0.0.0 --port=5000 &

# 6. Mensaje final
sleep 2
echo "[INFO] Todo listo. Accede a la wallet en: http://localhost:5000/"