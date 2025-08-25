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
