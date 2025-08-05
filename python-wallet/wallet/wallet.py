"""
Wallet profesional para Ecocoin Blockchain.
Permite generar claves, firmar transacciones y consultar balances.
"""
import os
import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
import requests

API_URL = 'http://127.0.0.1:5000'

class Wallet:
    def __init__(self, private_key=None):
        if private_key:
            self.private_key = serialization.load_pem_private_key(private_key.encode(), password=None)
        else:
            self.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        self.public_key = self.private_key.public_key()

    def get_address(self):
        pem = self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        return base64.urlsafe_b64encode(pem).decode()[:32]  # Dirección corta

    def export_private_key(self):
        return self.private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode()

    def export_public_key(self):
        return self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode()

    def sign_transaction(self, sender, recipient, amount):
        message = f"{sender}:{recipient}:{amount}".encode()
        signature = self.private_key.sign(
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return base64.b64encode(signature).decode()

    def send_transaction(self, recipient, amount):
        sender = self.get_address()
        signature = self.sign_transaction(sender, recipient, amount)
        data = {
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'signature': signature,
            'public_key': self.export_public_key()
        }
        r = requests.post(f'{API_URL}/add_transaction', json=data)
        print('Send transaction:', r.status_code, r.text)

    def get_balance(self):
        address = self.get_address()
        r = requests.get(f'{API_URL}/balance/{address}')
        print(f'Balance {address}:', r.status_code, r.json())

if __name__ == '__main__':
    print('=== Wallet Ecocoin ===')
    if not os.path.exists('wallet.key'):
        wallet = Wallet()
        with open('wallet.key', 'w') as f:
            f.write(wallet.export_private_key())
        print('Nueva wallet creada.')
    else:
        with open('wallet.key', 'r') as f:
            private_key = f.read()
        wallet = Wallet(private_key)
        print('Wallet cargada.')
    print('Dirección:', wallet.get_address())
    print('Balance:')
    wallet.get_balance()
    # Ejemplo de envío
    # wallet.send_transaction('destinatario', 5)
