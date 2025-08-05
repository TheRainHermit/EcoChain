"""
Este archivo ha sido migrado y modularizado.
Usa wallet/app.py como punto de entrada principal para la wallet web Ecocoin.
Las rutas y la lógica están en wallet/routes.py, blockchain_integration.py y db_integration.py.
"""


import os
from flask import Flask, render_template_string, request, redirect, url_for, flash, session
from mnemonic import Mnemonic
from eth_account import Account
from wallet.db_integration import get_balances
from wallet.transaction_db import insert_transaction

app = Flask(__name__)
app.secret_key = 'cambia_esto_por_una_clave_segura'
global_blockchain = Blockchain()

TEMPLATE = '''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecocoin Wallet</title>
    <link rel="icon" href="/static/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%);
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
            margin: 0;
            min-height: 100vh;
        }
        .container {
            max-width: 420px;
            margin: 60px auto 0 auto;
            background: #fff;
            padding: 32px 28px 24px 28px;
            border-radius: 18px;
            box-shadow: 0 4px 24px #b2dfdb99;
            display: flex;
            flex-direction: column;
            gap: 18px;
        }
        .wallet-container {
            max-width: 500px;
            margin: 40px auto 0 auto;
            background: #fff;
            padding: 32px 28px 24px 28px;
            border-radius: 18px;
            box-shadow: 0 4px 24px #b2dfdb99;
            display: flex;
            flex-direction: column;
            gap: 18px;
        }
        h2 {
            color: #388e3c;
            margin-bottom: 12px;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        input[type="text"], input[type="number"], input[name="mnemonic"] {
            padding: 10px;
            border: 1px solid #b2dfdb;
            border-radius: 8px;
            font-size: 1em;
            background: #f1f8e9;
            transition: border 0.2s;
        }
        input:focus {
            border: 1.5px solid #388e3c;
            outline: none;
        }
        button {
            background: linear-gradient(90deg, #43a047 0%, #388e3c 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 0;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px #b2dfdb55;
        }
        button:hover {
            background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
        }
        .address-box {
            background: #f1f8e9;
            border-radius: 8px;
            padding: 10px;
            font-family: monospace;
            font-size: 0.98em;
            word-break: break-all;
            margin-bottom: 8px;
        }
        .balance-box {
            background: #e0f2f1;
            border-radius: 8px;
            padding: 10px;
            font-size: 1.1em;
            margin-bottom: 8px;
        }
        .flash {
            background: #c8e6c9;
            color: #256029;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            text-align: center;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container, .wallet-container {
                max-width: 98vw;
                padding: 18px 4vw 18px 4vw;
            }
        }
    </style>
</head>
<body>
    {% with messages = get_flashed_messages() %}
      {% if messages %}
        <div class="flash">{{ messages[0] }}</div>
      {% endif %}
    {% endwith %}
    {% if not session.get('logged_in') %}
    <div class="container">
        <h2><i class="fa-solid fa-leaf"></i> Ecocoin Wallet</h2>
        <form method="post" action="/import">
            <input name="mnemonic" placeholder="Frase secreta" autocomplete="off">
            <button type="submit"><i class="fa-solid fa-right-to-bracket"></i> Importar wallet</button>
        </form>
        <form method="post" action="/register">
            <button type="submit"><i class="fa-solid fa-plus"></i> Crear nueva wallet</button>
        </form>
    </div>
    {% endif %}
    {% if session.get('logged_in') %}
    <div class="wallet-container">
        <h2><i class="fa-solid fa-user"></i> Perfil de usuario</h2>
        <div class="address-box"><b>Dirección:</b><br>{{ session.device_id }}</div>
        <div class="balance-box"><b>Saldo Ecocoin:</b> {{ balances.eco }} <i class="fa-solid fa-coins" style="color:#43a047;"></i></div>
        <form method="post" action="/recargar_todas">
            <button type="submit"><i class="fa-solid fa-bolt"></i> Recargar saldo</button>
        </form>
        <form method="post" action="/send">
            <input type="text" name="recipient" placeholder="Destino (dirección)" required autocomplete="off">
            <input type="number" name="amount" placeholder="Cantidad" min="0.00000001" step="any" required>
            <select name="crypto" style="padding: 10px; border-radius: 8px; border: 1px solid #b2dfdb; background: #f1f8e9;">
                <option value="eco">Ecocoin</option>
                <option value="btc">Bitcoin</option>
                <option value="eth">Ethereum</option>
                <option value="usdt">Tether</option>
            </select>
            <button type="submit"><i class="fa-solid fa-paper-plane"></i> Enviar</button>
        </form>
        <form method="post" action="/logout">
            <button type="submit"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
        </form>
    </div>
    {% endif %}
</body>
</html>
'''

@app.route('/', methods=['GET'])
def index():
    if session.get('logged_in'):
        address = session.get('device_id')
        balances = get_balances(address)
        return render_template_string(TEMPLATE, balances=balances)
    return render_template_string(TEMPLATE)

@app.route('/register', methods=['POST'])
def register():
    mnemo = Mnemonic('english')
    mnemonic = mnemo.generate(strength=128)
    acct = Account.from_mnemonic(mnemonic)
    address = acct.address
    # Inserta usuario y saldo inicial (airdrop) usando insert_transaction
    insert_transaction(
        sender=None,  # o 'system'
        recipient=address,
        amount=10000,
        crypto='eco',
        tx_type='airdrop'
    )
    session['logged_in'] = True
    session['device_id'] = address
    flash('Wallet creada correctamente.')
    return redirect(url_for('index'))

@app.route('/import', methods=['POST'])
def import_wallet():
    mnemonic = request.form.get('mnemonic')
    mnemo = Mnemonic('english')
    if not mnemo.check(mnemonic):
        flash('Frase secreta inválida.')
        return redirect(url_for('index'))
    acct = Account.from_mnemonic(mnemonic)
    address = acct.address
    # No necesitas inicializar balances, solo asegúrate de que el usuario existe
    session['logged_in'] = True
    session['device_id'] = address
    flash('Wallet importada correctamente.')
    return redirect(url_for('index'))

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/recargar_todas', methods=['POST'])
def recargar_todas():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    address = session.get('device_id')
    # Inserta una transacción de recarga
    insert_transaction(
        sender=None,  # o 'system'
        recipient=address,
        amount=10000,
        crypto='eco',
        tx_type='recarga'
    )
    flash('Saldo recargado.')
    return redirect(url_for('index'))

@app.route('/send', methods=['POST'])
def send():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    sender = session.get('device_id')
    recipient = request.form.get('recipient')
    amount = float(request.form.get('amount'))
    crypto = request.form.get('crypto', 'eco')
    balances = get_balances(sender)
    if crypto not in balances:
        flash('Moneda no soportada.')
        return redirect(url_for('index'))
    if balances[crypto] < amount:
        flash(f'Saldo insuficiente para realizar la transferencia de {crypto.upper()}.')
        return redirect(url_for('index'))
    # Inserta la transferencia como transacción
    insert_transaction(
        sender=sender,
        recipient=recipient,
        amount=amount,
        crypto=crypto,
        tx_type='transfer'
    )
    flash(f'Transferencia de {amount} {crypto.upper()} realizada.')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
