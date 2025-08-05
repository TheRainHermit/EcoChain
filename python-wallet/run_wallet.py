import subprocess
import sys
import time
from wallet.app import app  # Cambia esto según dónde esté tu Flask app principal

if __name__ == "__main__":
    # Inicia el nodo blockchain (node.py) en un proceso aparte
    node_proc = subprocess.Popen([sys.executable, "node.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("[INFO] Nodo blockchain iniciado en http://127.0.0.1:5000")
    time.sleep(2)  # Da tiempo a que el nodo arranque antes de iniciar la wallet

    try:
        print("[INFO] Iniciando microservicio wallet en http://127.0.0.1:8080 ...")
        app.run(port=8080, debug=True)
    finally:
        print("[INFO] Cerrando nodo blockchain...")
        node_proc.terminate()
        node_proc.wait()
