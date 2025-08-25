import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Rutas principales de la wallet Ecocoin (modularizado)
from flask import Blueprint, jsonify, render_template_string, request, redirect, url_for, flash, session
from mnemonic import Mnemonic
from eth_account import Account
from wallet.db_integration import get_balances
from wallet.transaction_db import insert_transaction
from wallet.nft_db import mint_nft, transfer_nft
# Importa tus funciones de usuario y autenticación según tu estructura

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

@bp.route('/api/custodial/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        password = data.get('password')
        if not password:
            return jsonify({'error': 'Password requerido.'}), 400

        mnemo = Mnemonic('english')
        mnemonic = mnemo.generate(strength=128)
        Account.enable_unaudited_hdwallet_features()
        acct = Account.from_mnemonic(mnemonic)
        address = acct.address
        register_user(address, mnemonic, password)
        return jsonify({
            'wallet_address': address,
            'mnemonic': mnemonic
        })
    except Exception as e:
        print(f"Error en /api/wallet/register: {e}", flush=True)
        return jsonify({'error': f'Error al crear wallet: {str(e)}'}), 500

@bp.route('/api/wallet/import', methods=['POST'])
def api_import_wallet():
    try:
        data = request.get_json()
        mnemonic = data.get('mnemonic')
        password = data.get('password')
        if not mnemonic or not password:
            return jsonify({'error': 'Mnemonic y password requeridos.'}), 400
        mnemo = Mnemonic('english')
        if not mnemo.check(mnemonic):
            return jsonify({'error': 'Frase secreta inválida.'}), 400
        Account.enable_unaudited_hdwallet_features()
        acct = Account.from_mnemonic(mnemonic)
        address = acct.address
        import_user(address, mnemonic, password)
        return jsonify({'wallet_address': address})
    except Exception as e:
        print(f"Error en /api/wallet/import: {e}", flush=True)
        return jsonify({'error': f'Error al importar wallet: {str(e)}'}), 500

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

# --- API REST: NFT Mint ---
@bp.route('/api/nft/mint', methods=['POST'])
def api_nft_mint():
    data = request.get_json()
    owner = data.get('owner')
    name = data.get('nft_name')
    description = data.get('nft_description')
    image_url = data.get('nft_image_url')
    if not all([owner, name, description, image_url]):
        return jsonify({'error': 'Datos incompletos'}), 400
    token_id = mint_nft(owner, name, description, image_url)
    return jsonify({'token_id': token_id})

# --- API REST: NFT Transfer ---
@bp.route('/api/nft/transfer', methods=['POST'])
def api_nft_transfer():
    data = request.get_json()
    from_addr = data.get('from_addr')
    token_id = data.get('nft_token_id')
    to_addr = data.get('nft_to_address')
    if not all([from_addr, token_id, to_addr]):
        return jsonify({'error': 'Datos incompletos'}), 400
    ok = transfer_nft(token_id, from_addr, to_addr)
    if ok:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'No eres el dueño del NFT o el NFT no existe.'}), 400

# --- API REST: Crear Wallet Custodial ---
@bp.route('/api/wallet/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        password = data.get('password')
        if not password:
            return jsonify({'error': 'Password requerido.'}), 400
        mnemo = Mnemonic('english')
        mnemonic = mnemo.generate(strength=128)
        Account.enable_unaudited_hdwallet_features()
        acct = Account.from_mnemonic(mnemonic)
        address = acct.address
        register_user(address, mnemonic, password)
        return jsonify({'wallet_address': address, 'mnemonic': mnemonic})
    except Exception as e:
        return jsonify({'error': f'Error al crear wallet: {str(e)}'}), 500

# --- API REST: Importar Wallet Custodial ---
@bp.route('/api/wallet/import', methods=['POST'])
def api_import_wallet():
    try:
        data = request.get_json()
        mnemonic = data.get('mnemonic')
        password = data.get('password')
        if not mnemonic or not password:
            return jsonify({'error': 'Mnemonic y password requeridos.'}), 400
        mnemo = Mnemonic('english')
        if not mnemo.check(mnemonic):
            return jsonify({'error': 'Frase secreta inválida.'}), 400
        Account.enable_unaudited_hdwallet_features()
        acct = Account.from_mnemonic(mnemonic)
        address = acct.address
        import_user(address, mnemonic, password)
        return jsonify({'wallet_address': address})
    except Exception as e:
        return jsonify({'error': f'Error al importar wallet: {str(e)}'}), 500

# --- API REST: Recargar saldo (airdrop) ---
@bp.route('/api/wallet/recargar', methods=['POST'])
def api_recargar():
    data = request.get_json()
    address = data.get('wallet_address')
    if not address:
        return jsonify({'error': 'wallet_address requerido'}), 400
    insert_transaction(
        sender=None,
        recipient=address,
        amount=10000,
        crypto='ECO',
        tx_type='airdrop'
    )
    return jsonify({'success': True})

# --- API REST: Enviar tokens ---
@bp.route('/api/wallet/send', methods=['POST'])
def api_send():
    data = request.get_json()
    sender = data.get('sender')
    recipient = data.get('recipient')
    amount = float(data.get('amount', 0))
    crypto = data.get('crypto', 'eco')
    password = data.get('password')
    if not all([sender, recipient, amount, password]):
        return jsonify({'error': 'Datos incompletos.'}), 400
    if not check_user_login(sender, password):
        return jsonify({'error': 'Password incorrecto.'}), 401
    balances = get_balances(sender)
    if balances.get(crypto, 0) < amount:
        return jsonify({'error': 'Saldo insuficiente.'}), 400
    insert_transaction(
        sender=sender,
        recipient=recipient,
        amount=amount,
        crypto=crypto,
        tx_type='transfer'
    )
    return jsonify({'success': True})

# --- API REST: Firmar transacción ---
@bp.route('/api/wallet/sign', methods=['POST'])
def api_sign_transaction():
    data = request.get_json()
    # Implementa aquí la lógica de firmado real
    return jsonify({'signed': True})

# --- API REST: Login custodial ---
@bp.route('/api/wallet/login', methods=['POST'])
def api_login():
    data = request.get_json()
    address = data.get('wallet_address')
    password = data.get('password')
    if not address or not password:
        return jsonify({'error': 'wallet_address y password requeridos.'}), 400
    if check_user_login(address, password):
        return jsonify({'success': True, 'wallet_address': address})
    else:
        return jsonify({'error': 'Credenciales incorrectas.'}), 401

# --- API REST: Estado del microservicio ---
@bp.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({'status': 'python-wallet microservice running'})

# --- API REST: Configuración (si necesitas exponer algo de config) ---
@bp.route('/api/configuracion', methods=['GET'])
def api_configuracion():
    return jsonify({'config': 'Aquí puedes exponer configuración si lo necesitas'})

# --- API REST: Logout (no hace nada, solo por compatibilidad) ---
@bp.route('/api/logout', methods=['POST'])
def api_logout():
    return jsonify({'success': True})
