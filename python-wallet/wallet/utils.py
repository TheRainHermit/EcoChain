# Utilidades para la wallet web Ecocoin
import os, uuid, base64, secrets, time, io, qrcode
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def encrypt_private_key(private_key: str, password: str) -> str:
    salt = os.urandom(16)
    kdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)
    key = kdf.derive(password.encode())
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, private_key.encode(), None)
    return base64.b64encode(salt + nonce + ct).decode()

def decrypt_private_key(enc: str, password: str) -> str:
    data = base64.b64decode(enc)
    salt, nonce, ct = data[:16], data[16:28], data[28:]
    kdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)
    key = kdf.derive(password.encode())
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ct, None).decode()

def generate_qr_token():
    token = secrets.token_urlsafe(16)
    return token

# Puedes agregar aquí más utilidades según sea necesario
