from flask import Flask, request, jsonify, send_from_directory
from ecocoin.blockchain import Blockchain
import random
import string
from datetime import datetime, timedelta
import os

app = Flask(__name__)
blockchain = Blockchain()

@app.route('/chain', methods=['GET'])
def get_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append({
            'index': block.index,
            'previous_hash': block.previous_hash,
            'timestamp': block.timestamp,
            'transactions': [tx.__dict__ for tx in block.transactions],
            'nonce': block.nonce,
            'hash': block.hash
        })
    return jsonify({'length': len(chain_data), 'chain': chain_data})

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    data = request.get_json()
    required = ['sender', 'recipient', 'amount', 'signature', 'public_key']
    if not all(k in data for k in required):
        return 'Faltan datos', 400
    success = blockchain.add_transaction(
        data['sender'], data['recipient'], data['amount'], data['signature'], data['public_key']
    )
    if not success:
        return 'Transacción inválida', 400
    return 'Transacción agregada', 201

@app.route('/mine', methods=['POST'])
def mine():
    data = request.get_json()
    miner = data.get('miner')
    if not miner:
        return 'Falta el minero', 400
    success = blockchain.mine_pending_transactions(miner)
    if not success:
        return 'Nada que minar', 400
    return 'Bloque minado', 201

@app.route('/balance/<address>', methods=['GET'])
def get_balance(address):
    balance = blockchain.get_balance(address)
    return jsonify({'address': address, 'balance': balance})

@app.route('/set_reward', methods=['POST'])
def set_reward():
    data = request.get_json()
    new_reward = data.get('reward')
    if new_reward is None:
        return 'Falta el valor de recompensa', 400
    blockchain.set_mining_reward(float(new_reward))
    return f'Recompensa actualizada a {new_reward}', 200

@app.route('/add_contract', methods=['POST'])
def add_contract():
    data = request.get_json()
    name = data.get('name')
    code = data.get('code')
    if not name or not code:
        return 'Faltan datos', 400
    blockchain.add_contract(name, code)
    return f'Contrato {name} agregado', 201

@app.route('/create_token', methods=['POST'])
def create_token():
    data = request.get_json()
    name = data.get('name')
    symbol = data.get('symbol')
    total_supply = data.get('total_supply')
    owner = data.get('owner')
    if not all([name, symbol, total_supply, owner]):
        return 'Faltan datos', 400
    success = blockchain.create_token(name, symbol, float(total_supply), owner)
    if not success:
        return 'No se pudo crear el token', 400
    return f'Token {symbol} creado', 201

@app.route('/transfer_token', methods=['POST'])
def transfer_token():
    data = request.get_json()
    symbol = data.get('symbol')
    sender = data.get('sender')
    recipient = data.get('recipient')
    amount = data.get('amount')
    if not all([symbol, sender, recipient, amount]):
        return 'Faltan datos', 400
    success = blockchain.transfer_token(symbol, sender, recipient, float(amount))
    if not success:
        return 'Transferencia fallida', 400
    return 'Transferencia exitosa', 200

@app.route('/token_balance/<symbol>/<address>', methods=['GET'])
def token_balance(symbol, address):
    balance = blockchain.token_balance_of(symbol, address)
    return jsonify({'symbol': symbol, 'address': address, 'balance': balance})

@app.route('/set_role', methods=['POST'])
def set_role():
    data = request.get_json()
    address = data.get('address')
    role = data.get('role')
    requester = data.get('requester')
    if not all([address, role, requester]):
        return 'Faltan datos', 400
    success = blockchain.set_role(address, role, requester)
    if not success:
        return 'No autorizado o rol inválido', 403
    return f'Rol {role} asignado a {address}', 200

@app.route('/mint_nft', methods=['POST'])
def mint_nft():
    data = request.get_json()
    token_id = data.get('token_id')
    owner = data.get('owner')
    metadata = data.get('metadata', {})
    if not all([token_id, owner]):
        return 'Faltan datos', 400
    success = blockchain.mint_nft(token_id, owner, metadata)
    if not success:
        return 'No se pudo crear el NFT', 400
    return f'NFT {token_id} creado', 201

@app.route('/transfer_nft', methods=['POST'])
def transfer_nft():
    data = request.get_json()
    token_id = data.get('token_id')
    new_owner = data.get('new_owner')
    if not all([token_id, new_owner]):
        return 'Faltan datos', 400
    success = blockchain.transfer_nft(token_id, new_owner)
    if not success:
        return 'Transferencia fallida', 400
    return 'Transferencia exitosa', 200

# Eliminar endpoints mock y conectar con datos reales
@app.route('/nft_owner/<address>', methods=['GET'])
def nfts_by_owner(address):
    nfts = blockchain.get_nfts_by_owner(address)
    return jsonify({'nfts': nfts})

@app.route('/tx_history/<address>', methods=['GET'])
def tx_history(address):
    history = blockchain.get_tx_history(address)
    return jsonify({'history': history})

@app.route('/balances/<address>', methods=['GET'])
def balances(address):
    balances = blockchain.get_all_balances(address)
    return jsonify({'balances': balances})

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), 'wallet', 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

if __name__ == '__main__':
    app.run(port=8081, debug=True)
