import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Rutas principales de la wallet Ecocoin (modularizado)
from flask import Blueprint, render_template_string, request, redirect, url_for, flash, session
from mnemonic import Mnemonic
from eth_account import Account
from wallet.db_integration import get_balances
from wallet.transaction_db import insert_transaction
from wallet.nft_db import mint_nft, transfer_nft, get_nfts_by_owner, get_nft_transactions
import uuid
from werkzeug.security import generate_password_hash
from wallet.auth import jwt_required

bp = Blueprint('wallet', __name__)

# --- Rutas para NFTs ---
@bp.route('/nft/mint', methods=['POST'])
def nft_mint():
    if not session.get('logged_in'):
        return redirect(url_for('wallet.index'))
    owner = session.get('device_id')
    name = request.form.get('nft_name')
    description = request.form.get('nft_description')
    image_url = request.form.get('nft_image_url')
    token_id = mint_nft(owner, name, description, image_url)
    flash(f'NFT "{name}" minteado correctamente.')
    return redirect(url_for('wallet.index'))

@bp.route('/nft/transfer', methods=['POST'])
def nft_transfer():
    if not session.get('logged_in'):
        return redirect(url_for('wallet.index'))
    from_addr = session.get('device_id')
    token_id = request.form.get('nft_token_id')
    to_addr = request.form.get('nft_to_address')
    ok = transfer_nft(token_id, from_addr, to_addr)
    if ok:
        flash('NFT transferido correctamente.')
    else:
        flash('Error: No eres el dueño del NFT o el NFT no existe.')
    return redirect(url_for('wallet.index'))
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

bp = Blueprint('wallet', __name__)

@bp.route('/', methods=['GET'])
def index():
    balances = None
    error = None
    transactions = []
    if session.get('logged_in'):
        address = session.get('device_id')
        try:
            balances = get_balances(address)
            txs = get_transactions_by_address(address)
            transactions = [
                (tx[0], tx[1], tx[2], tx[3], tx[4], tx[5].strftime('%Y-%m-%d %H:%M') if hasattr(tx[5], 'strftime') else str(tx[5]))
                for tx in txs
            ]
        except Exception as e:
            balances = {'eco': 0, 'btc': 0, 'eth': 0, 'usdt': 0}
            error = f"Error al obtener saldo: {str(e)}"
        return render_template_string(TEMPLATE, balances=balances, error=error, transactions=transactions)
    return render_template_string(TEMPLATE, balances=balances, error=error, transactions=transactions)

@bp.route('/register', methods=['POST'])
def register():
    try:
        mnemo = Mnemonic('english')
        mnemonic = mnemo.generate(strength=128)
        Account.enable_unaudited_hdwallet_features()
        acct = Account.from_mnemonic(mnemonic)
        address = acct.address
        password = request.form.get('password')
        device_id = str(uuid.getnode())
        register_user(address, mnemonic, password, device_id)
        # Si quieres dar saldo inicial, inserta una transacción:
        insert_transaction(
            sender=None,  # o 'system'
            recipient=address,
            amount=10000,
            crypto='ECO',
            tx_type='airdrop'
        )
        session['logged_in'] = True
        session['device_id'] = address
        flash('Wallet creada correctamente.')
        return redirect(url_for('wallet.index'))
    except Exception as e:
        print(f"Error en /register: {e}", flush=True)
        flash(f"Error al crear wallet: {e}")
        return redirect(url_for('wallet.index'))

@bp.route('/import', methods=['POST'])
def import_wallet():
    mnemonic = request.form.get('mnemonic')
    mnemo = Mnemonic('english')
    if not mnemo.check(mnemonic):
        flash('Frase secreta inválida.')
        return redirect(url_for('wallet.index'))
    Account.enable_unaudited_hdwallet_features()
    acct = Account.from_mnemonic(mnemonic)
    address = acct.address
    import_user(address, mnemonic)
    ensure_wallet_and_balance(address)
    session['logged_in'] = True
    session['device_id'] = address
    flash('Wallet importada correctamente.')
    return redirect(url_for('wallet.index'))

@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('wallet.index'))

@bp.route('/recargar_todas', methods=['POST'])
def recargar_todas():
    if not session.get('logged_in'):
        return redirect(url_for('wallet.index'))
    address = session.get('device_id')
    ensure_wallet_and_balance(address, eco=10000)
    flash('Saldo recargado.')
    return redirect(url_for('wallet.index'))

@bp.route('/send', methods=['POST'])
def send():
    if not session.get('logged_in'):
        return redirect(url_for('wallet.index'))
    sender = session.get('device_id')
    recipient = request.form.get('recipient')
    amount = float(request.form.get('amount'))
    crypto = request.form.get('crypto', 'eco')
    # Validación de saldo suficiente
    balances = get_balances(sender)
    if balances.get(crypto, 0) < amount:
        flash('Saldo insuficiente para realizar la transferencia.')
        return redirect(url_for('wallet.index'))
    # Realiza la transferencia insertando una transacción
    insert_transaction(
        sender=sender,
        recipient=recipient,
        amount=amount,
        crypto=crypto,
        tx_type='transfer'
    )
    flash('Transferencia realizada.')
    return redirect(url_for('wallet.index'))

@bp.route('/eliminar_todos', methods=['POST'])
def eliminar_todos():
    delete_all_users()
    flash('¡Todos los usuarios y balances han sido eliminados!')
    return redirect(url_for('wallet.index'))

@bp.route('/configuracion', methods=['GET', 'POST'])
def configuracion():
    if not session.get('logged_in'):
        return redirect(url_for('wallet.index'))
    address = session.get('device_id')
    mnemonic = None
    message = None
    theme = request.cookies.get('theme', 'light')
    if request.method == 'POST':
        if 'show_mnemonic' in request.form:
            conn = get_userdb_connection()
            cur = conn.cursor()
            # Solo para usuarios custodial
            cur.execute("SELECT mnemonic FROM users WHERE address = %s", (address,))
            row = cur.fetchone()
            if row and row[0]:
                mnemonic = decrypt_mnemonic(row[0])  # Implementa tu función de desencriptado
        elif 'change_password' in request.form:
            old = request.form.get('old_password')
            new = request.form.get('new_password')
            from wallet.user_db import check_user_login
            device_id = str(uuid.getnode())
            if check_user_login(address, old, device_id):
                conn = get_userdb_connection()
                cur = conn.cursor()
                cur.execute("UPDATE users SET password_hash = %s WHERE address = %s", (generate_password_hash(new), address))
                conn.commit()
                cur.close()
                conn.close()
                message = 'Contraseña cambiada correctamente.'
            else:
                message = 'Contraseña actual incorrecta.'
        elif 'theme' in request.form:
            theme = 'dark' if request.form.get('theme') == 'dark' else 'light'
    # Renderiza la plantilla de configuración, completamente separada
    resp = render_template_string(
        CONFIG_TEMPLATE,
        address=address,
        mnemonic=mnemonic,
        message=message,
        theme=theme
    )
    if request.method == 'POST' and 'theme' in request.form:
        from flask import current_app
        resp_obj = current_app.make_response(resp)
        resp_obj.set_cookie('theme', theme, max_age=60*60*24*365)
        return resp_obj
    return resp

@bp.route('/login', methods=['POST'])
def login():
    password = request.form.get('password')
    device_id = str(uuid.getnode())
    # Buscar address por device_id
    conn = get_userdb_connection()
    cur = conn.cursor()
    cur.execute("SELECT address FROM users WHERE device_id = %s", (device_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        flash('No hay usuario registrado en este dispositivo. Crea o importa una wallet.')
        return redirect(url_for('wallet.index'))
    address = row[0]
    if check_user_login(address, password, device_id):
        session['logged_in'] = True
        session['device_id'] = address
        flash('Inicio de sesión exitoso.')
    else:
        flash('Contraseña incorrecta o no coincide el dispositivo.')
    return redirect(url_for('wallet.index'))

@bp.route('/api/wallet/sign', methods=['POST'])
@jwt_required
def sign_transaction():
    # Solo usuarios autenticados pueden firmar
    pass
