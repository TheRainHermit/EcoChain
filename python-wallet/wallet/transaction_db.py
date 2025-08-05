# transaction_db.py - Manejo de transacciones en la base de datos principal (unificado con ecochain)
from wallet.db import get_connection

def insert_transaction(sender, recipient, amount, crypto, tx_type='transfer', reference_id=None):
    """
    Inserta una transacción en la tabla unificada wallet_transactions.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO wallet_transactions (sender, recipient, amount, crypto, type, reference_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (sender, recipient, amount, crypto, tx_type, reference_id))
    conn.commit()
    cur.close()
    conn.close()

def get_transactions_by_address(address):
    """
    Obtiene todas las transacciones (enviadas o recibidas) por una dirección.
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, sender, recipient, amount, crypto, type, reference_id, timestamp
        FROM wallet_transactions
        WHERE sender = %s OR recipient = %s
        ORDER BY timestamp DESC
    """, (address, address))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
