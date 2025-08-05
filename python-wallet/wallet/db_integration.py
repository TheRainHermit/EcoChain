from wallet.db import get_connection

def get_balances(address):
    conn = get_connection()
    cur = conn.cursor()
    balances = {}
    for crypto in ["eco", "btc", "eth", "usdt"]:
        cur.execute("""
            SELECT
                COALESCE(SUM(
                    CASE WHEN recipient = %s THEN amount
                         WHEN sender = %s THEN -amount
                         ELSE 0 END
                ), 0) AS balance
            FROM wallet_transactions
            WHERE LOWER(crypto) = %s
        """, (address, address, crypto.upper()))
        row = cur.fetchone()
        balances[crypto] = float(row[0]) if row and row[0] is not None else 0
    cur.close()
    conn.close()
    return balances
