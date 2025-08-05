# Utilidad para inicializar saldo y hacer pruebas de transferencias entre criptos
# def ensure_wallet_and_balance(address, eco=10000, btc=10000, eth=10000, usdt=10000):
#    conn = get_connection()
 #   cur = conn.cursor()
    # Crea la tabla balances si no existe
  #  cur.execute('''
   #     CREATE TABLE IF NOT EXISTS balances (
    #        address VARCHAR(128) PRIMARY KEY,
     #       eco NUMERIC DEFAULT 0,
      #      btc NUMERIC DEFAULT 0,
       #     eth NUMERIC DEFAULT 0,
        #    usdt NUMERIC DEFAULT 0
        #)
   # ''')
    # Solo crea la wallet si no existe, no sobreescribe balances existentes
   # cur.execute("SELECT address FROM balances WHERE address = %s", (address,))
    #if not cur.fetchone():
     #   cur.execute("INSERT INTO balances (address, eco, btc, eth, usdt) VALUES (%s, %s, %s, %s, %s)", (address, eco, btc, eth, usdt))
    #conn.commit()
    #cur.close()
    #conn.close()
# db.py
import psycopg2

# Configura aquí tu base de datos PostgreSQL (debe ser la misma que usa ecochain)
DB_HOST = 'localhost'
DB_PORT = 5432
DB_NAME = 'ecochain'
DB_USER = 'postgres'
DB_PASS = 'admin'

def get_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
