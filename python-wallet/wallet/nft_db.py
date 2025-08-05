# nft_db.py - Gestión de NFTs estilo ERC-721 para Ecocoin
import psycopg2
import uuid
from wallet.db import get_connection

def mint_nft(user_id, token_id, metadata=None):
    conn = get_connection()
    cur = conn.cursor()
    # Insertar en user_nfts
    cur.execute("""
        INSERT INTO user_nfts (user_id, token_id, metadata)
        VALUES (%s, %s, %s)
        RETURNING id
    """, (user_id, token_id, metadata))
    nft_id = cur.fetchone()[0]
    # Registrar minteo en nft_transactions
    cur.execute("""
        INSERT INTO nft_transactions (nft_id, from_user_id, to_user_id, tx_type)
        VALUES (%s, NULL, %s, 'mint')
    """, (nft_id, user_id))
    conn.commit()
    cur.close()
    conn.close()
    return nft_id

def transfer_nft(nft_id, from_user_id, to_user_id):
    conn = get_connection()
    cur = conn.cursor()
    # Cambiar propietario en user_nfts
    cur.execute("UPDATE user_nfts SET user_id = %s WHERE id = %s AND user_id = %s",
                (to_user_id, nft_id, from_user_id))
    if cur.rowcount == 0:
        cur.close()
        conn.close()
        return False
    # Registrar transferencia en nft_transactions
    cur.execute("""
        INSERT INTO nft_transactions (nft_id, from_user_id, to_user_id, tx_type)
        VALUES (%s, %s, %s, 'transfer')
    """, (nft_id, from_user_id, to_user_id))
    conn.commit()
    cur.close()
    conn.close()
    return True

def get_nfts_by_owner(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, token_id, metadata, minted_at FROM user_nfts WHERE user_id = %s", (user_id,))
    nfts = cur.fetchall()
    cur.close()
    conn.close()
    return nfts

def get_nft_transactions(nft_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT from_user_id, to_user_id, tx_type, price_eth, tx_hash, created_at FROM nft_transactions WHERE nft_id = %s ORDER BY created_at DESC", (nft_id,))
    txs = cur.fetchall()
    cur.close()
    conn.close()
    return txs
