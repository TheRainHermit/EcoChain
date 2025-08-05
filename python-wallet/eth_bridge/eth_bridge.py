"""
Bridge para compatibilidad con wallets Ethereum (MetaMask, Trust Wallet, etc.)
Permite recibir transacciones firmadas con ECDSA/secp256k1 y adaptarlas a la blockchain Ecocoin.
"""
from flask import Flask, request, jsonify
from eth_account import Account
import requests
import json

API_URL = 'http://127.0.0.1:5000'

app = Flask(__name__)

@app.route('/eth_bridge', methods=['POST'])
def eth_bridge():
    data = request.get_json()
    # Espera: {'sender': '0x...', 'recipient': '0x...', 'amount': float, 'signature': '0x...', 'message': '...'}
    sender = data.get('sender')
    recipient = data.get('recipient')
    amount = data.get('amount')
    signature = data.get('signature')
    message = data.get('message')
    if not all([sender, recipient, amount, signature, message]):
        return 'Faltan datos', 400
    # Verificar firma ECDSA
    try:
        recovered = Account.recover_message(text=message, signature=signature)
        if recovered.lower() != sender.lower():
            return 'Firma inválida', 400
    except Exception as e:
        return f'Error verificando firma: {e}', 400
    # Adaptar a formato Ecocoin
    tx_data = {
        'sender': sender,
        'recipient': recipient,
        'amount': amount,
        'signature': signature,
        'public_key': None  # No se usa en ECDSA, pero se puede guardar si se desea
    }
    r = requests.post(f'{API_URL}/add_transaction', json=tx_data)
    return f'Transacción adaptada y enviada: {r.status_code} {r.text}', r.status_code

if __name__ == '__main__':
    app.run(port=5050, debug=True)
