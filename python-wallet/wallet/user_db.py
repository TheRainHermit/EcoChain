# user_db.py - Manejo de usuarios en base de datos separada
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from wallet.db import get_connection

def register_user(address, mnemonic, password, device_id):
    """
    Registra un usuario custodial en la tabla users de ecochain.
    Asegúrate de que la tabla users tenga los campos: address, mnemonic, password_hash, device_id, created_at.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT address FROM users WHERE address = %s", (address,))
    if not cur.fetchone():
        password_hash = generate_password_hash(password)
        cur.execute("""
            INSERT INTO users (address, mnemonic, password_hash, device_id, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (address, mnemonic, password_hash, device_id, datetime.utcnow()))
        conn.commit()
    cur.close()
    conn.close()

def import_user(address, mnemonic, password=None, device_id=None):
    """
    Importa un usuario custodial (solo si no existe).
    Si se provee password y device_id, los almacena.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT address FROM users WHERE address = %s", (address,))
    if not cur.fetchone():
        if password and device_id:
            password_hash = generate_password_hash(password)
            cur.execute("""
                INSERT INTO users (address, mnemonic, password_hash, device_id, created_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (address, mnemonic, password_hash, device_id, datetime.utcnow()))
        else:
            cur.execute("""
                INSERT INTO users (address, mnemonic, created_at)
                VALUES (%s, %s, %s)
            """, (address, mnemonic, datetime.utcnow()))
        conn.commit()
    cur.close()
    conn.close()

def check_user_login(address, password, device_id):
    """
    Verifica login de usuario custodial.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT password_hash, device_id FROM users WHERE address = %s", (address,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row and check_password_hash(row[0], password) and row[1] == device_id:
        return True
    return False
