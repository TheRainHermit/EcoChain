# Plantilla HTML para la sección de configuración de la wallet Ecocoin
CONFIG_TEMPLATE = '''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuración - Ecocoin Wallet</title>
    <link rel="icon" href="/static/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #e8f5e9 0%, #b2dfdb 100%);
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
            margin: 0;
            min-height: 100vh;
        }
        .config-container {
            max-width: 420px;
            margin: 60px auto 0 auto;
            background: #fff;
            padding: 40px 36px 32px 36px;
            border-radius: 24px;
            box-shadow: 0 8px 32px #b2dfdb77, 0 1.5px 0 #43a047;
            display: flex;
            flex-direction: column;
            gap: 24px;
            border: 2px solid #43a047;
            position: relative;
            animation: fadein 1.2s;
        }
        @keyframes fadein {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: none; }
        }
        h2 {
            color: #1b5e20;
            margin-bottom: 18px;
            letter-spacing: 1.5px;
            font-size: 2.2em;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 800;
            text-shadow: 0 2px 8px #b2dfdb55;
        }
        .address-box {
            background: #e3f2fd;
            border-radius: 14px;
            padding: 16px;
            font-family: monospace;
            font-size: 1.08em;
            word-break: break-all;
            margin-bottom: 12px;
            border: 2px solid #b2dfdb;
            box-shadow: 0 1px 6px #b2dfdb33;
        }
        .flash {
            background: linear-gradient(90deg, #b2dfdb 0%, #c8e6c9 100%);
            color: #256029;
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 16px;
            text-align: center;
            font-weight: 600;
            border: 2px solid #43a047;
            box-shadow: 0 1px 6px #b2dfdb33;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        input[type="password"] {
            padding: 16px;
            border: 2px solid #b2dfdb;
            border-radius: 14px;
            font-size: 1.12em;
            background: #f4faff;
            transition: border 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px #b2dfdb33;
        }
        input:focus {
            border: 2.5px solid #43a047;
            outline: none;
            background: #e3f2fd;
        }
        button {
            background: linear-gradient(90deg, #43a047 0%, #b2dfdb 100%);
            color: #fff;
            border: none;
            border-radius: 14px;
            padding: 16px 0;
            font-size: 1.12em;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
            box-shadow: 0 2px 12px #b2dfdb55;
            letter-spacing: 0.5px;
        }
        button:hover {
            background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
            color: #fffde7;
            transform: translateY(-2px) scale(1.04);
        }
        @media (max-width: 600px) {
            .config-container {
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
    {% if message %}
      <div class="flash">{{ message }}</div>
    {% endif %}
    <div class="config-container">
        <h2><i class="fa-solid fa-gear"></i> Configuración</h2>
        <div class="address-box"><b>Dirección:</b><br>
            <span id="user-address">{{ address }}</span>
            <button onclick="copiarDireccion()" title="Copiar dirección" style="margin-left:8px;padding:4px 8px;font-size:0.95em;background:#b2dfdb;color:#256029;border:none;border-radius:5px;cursor:pointer;">
                <i class="fa-regular fa-copy"></i>
            </button>
            <br>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ address }}" alt="QR Dirección" style="margin-top:8px;border-radius:8px;">
        </div>
        <div class="address-box" style="background:#fffde7;">
            <b>Opciones de seguridad:</b><br>
            <ul style="margin:8px 0 0 18px;padding:0;font-size:1em;">
                <li><b>Contraseña:</b> <span style="color:#388e3c;">Protegida</span></li>
                <li><b>Dispositivo vinculado:</b> <span style="color:#388e3c;">Sí</span></li>
                <li><b>Recuperación:</b> Guarda tu clave secreta (mnemonic) en un lugar seguro.</li>
            </ul>
        </div>
        <form method="post" action="/configuracion" class="mnemonic-actions" id="mnemonic-actions-form">
            <button type="submit" name="show_mnemonic" id="btn-mostrar-mnemonic" style="background:#388e3c;">Mostrar clave secreta</button>
            <button type="button" id="btn-copiar-mnemonic" style="background:#1976d2;">Copiar clave</button>
            <button type="button" id="btn-exportar-mnemonic" style="background:#ffa000;">Exportar clave</button>
        </form>
        {% if mnemonic %}
        <div class="address-box" id="mnemonic-box" style="background:#e3f2fd;word-break:break-all;"><b>Clave secreta:</b><br><span id="mnemonic">{{ mnemonic }}</span></div>
        {% endif %}
        <form method="post" action="/configuracion" style="margin-bottom:10px;">
            <input type="password" name="old_password" placeholder="Contraseña actual" required>
            <input type="password" name="new_password" placeholder="Nueva contraseña" required>
            <button type="submit" name="change_password" style="background:#ffa000;">Cambiar contraseña</button>
        </form>
        <form method="post" action="/configuracion" class="theme-switch">
            <button type="submit" name="theme" value="light" style="background:#43a047;">Tema claro</button>
            <button type="submit" name="theme" value="dark" style="background:#263238;">Tema oscuro</button>
        </form>
        <form method="post" action="/logout">
            <button type="submit"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
        </form>
        <a href="/" style="color:#1976d2;text-decoration:underline;">&larr; Volver a la wallet</a>
    </div>
    <script>
    // Copiar dirección
    document.addEventListener('DOMContentLoaded', function() {
        var btnDireccion = document.getElementById('user-address');
        var btnCopiarDireccion = document.getElementById('btn-copiar-direccion');
        if (btnCopiarDireccion) {
            btnCopiarDireccion.addEventListener('click', function() {
                var texto = btnDireccion.innerText;
                navigator.clipboard.writeText(texto);
            });
        }
        // Copiar clave secreta
        var btnCopiarMnemonic = document.getElementById('btn-copiar-mnemonic');
        if (btnCopiarMnemonic) {
            btnCopiarMnemonic.addEventListener('click', function() {
                var mnemonic = document.getElementById('mnemonic');
                if (mnemonic) {
                    navigator.clipboard.writeText(mnemonic.innerText);
                    alert('Clave secreta copiada al portapapeles');
                } else {
                    alert('Primero haz clic en "Mostrar clave secreta".');
                }
            });
        }
        // Exportar clave secreta
        var btnExportarMnemonic = document.getElementById('btn-exportar-mnemonic');
        if (btnExportarMnemonic) {
            btnExportarMnemonic.addEventListener('click', function() {
                var mnemonic = document.getElementById('mnemonic');
                if (mnemonic) {
                    var blob = new Blob([mnemonic.innerText], {type: 'text/plain'});
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'mnemonic.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } else {
                    alert('Primero haz clic en "Mostrar clave secreta".');
                }
            });
        }
    });
    </script>
</body>
</html>
'''
# Plantilla HTML principal para la wallet Ecocoin
TEMPLATE = '''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecochain Wallet</title>
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
            padding: 40px 36px 32px 36px;
            border-radius: 24px;
            box-shadow: 0 8px 32px #b2dfdb77, 0 1.5px 0 #43a047;
            display: flex;
            flex-direction: column;
            gap: 24px;
            border: 2px solid #43a047;
            position: relative;
            animation: fadein 1.2s;
        }
        .wallet-container {
            max-width: 540px;
            margin: 40px auto 0 auto;
            background: #fff;
            padding: 48px 40px 36px 40px;
            border-radius: 24px;
            box-shadow: 0 8px 32px #b2dfdb77, 0 1.5px 0 #43a047;
            display: flex;
            flex-direction: column;
            gap: 24px;
            border: 2px solid #43a047;
            position: relative;
            animation: fadein 1.2s;
        }
        @keyframes fadein {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: none; }
        }
        h2 {
            color: #1b5e20;
            margin-bottom: 18px;
            letter-spacing: 1.5px;
            font-size: 2.2em;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 800;
            text-shadow: 0 2px 8px #b2dfdb55;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        input[type="text"], input[type="number"], input[name="mnemonic"], input[type="password"] {
            padding: 16px;
            border: 2px solid #b2dfdb;
            border-radius: 14px;
            font-size: 1.12em;
            background: #f4faff;
            transition: border 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px #b2dfdb33;
        }
        input:focus {
            border: 2.5px solid #43a047;
            outline: none;
            background: #e3f2fd;
        }
        button {
            background: linear-gradient(90deg, #43a047 0%, #b2dfdb 100%);
            color: #fff;
            border: none;
            border-radius: 14px;
            padding: 16px 0;
            font-size: 1.12em;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
            box-shadow: 0 2px 12px #b2dfdb55;
            letter-spacing: 0.5px;
        }
        button:hover {
            background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
            color: #fffde7;
            transform: translateY(-2px) scale(1.04);
        }
        .address-box {
            background: #e3f2fd;
            border-radius: 14px;
            padding: 16px;
            font-family: monospace;
            font-size: 1.08em;
            word-break: break-all;
            margin-bottom: 12px;
            border: 2px solid #b2dfdb;
            box-shadow: 0 1px 6px #b2dfdb33;
        }
        .balance-box {
            background: #f1f8e9;
            border-radius: 14px;
            padding: 16px;
            font-size: 1.18em;
            margin-bottom: 12px;
            border: 2px solid #b2dfdb;
            box-shadow: 0 1px 6px #b2dfdb33;
        }
        .flash {
            background: linear-gradient(90deg, #b2dfdb 0%, #c8e6c9 100%);
            color: #256029;
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 16px;
            text-align: center;
            font-weight: 600;
            border: 2px solid #43a047;
            box-shadow: 0 1px 6px #b2dfdb33;
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
    {% if error %}
      <div class="flash" style="background:#ffcdd2;color:#b71c1c;">{{ error }}</div>
    {% endif %}
    {% if not session.get('logged_in') %}
    <div class="container">
        <h2><i class="fa-solid fa-leaf"></i> Ecochain Wallet</h2>
        <form method="post" action="/login">
            <input type="password" name="password" placeholder="Contraseña" required>
            <button type="submit"><i class="fa-solid fa-right-to-bracket"></i> Iniciar sesión</button>
        </form>
        <form method="post" action="/import">
            <input name="mnemonic" placeholder="Frase secreta" autocomplete="off">
            <button type="submit"><i class="fa-solid fa-key"></i> Importar wallet</button>
        </form>
        <form method="post" action="/register">
            <input type="password" name="password" placeholder="Elige una contraseña" required>
            <button type="submit"><i class="fa-solid fa-plus"></i> Crear nueva wallet</button>
        </form>
    </div>
    {% endif %}
    {% if session.get('logged_in') %}
    <div class="wallet-container">
        <h2><i class="fa-solid fa-user"></i> Perfil de usuario</h2>
        <div class="address-box" style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;">
            <div style="width:100%;display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <b>Dirección:</b>
                    <span id="user-address">{{ session.device_id }}</span>
                    <button id="btn-copiar-direccion" title="Copiar dirección" style="margin-left:4px;padding:4px 8px;font-size:0.95em;background:#b2dfdb;color:#256029;border:none;border-radius:5px;cursor:pointer;">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
                <a href="/configuracion" title="Configuración" style="padding:6px 14px;font-size:1.1em;background:#43a047;color:#fff;border:none;border-radius:8px;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:7px;box-shadow:0 2px 8px #b2dfdb33;">
                    <i class="fa-solid fa-gear"></i> <span style="font-size:0.98em;font-weight:500;">Configuración</span>
                </a>
            </div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ session.device_id }}" alt="QR Dirección" style="margin-top:8px;border-radius:8px;">
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            var btn = document.getElementById('btn-copiar-direccion');
            if (btn) {
                btn.addEventListener('click', function() {
                    var texto = document.getElementById('user-address').innerText;
                    navigator.clipboard.writeText(texto);
                });
            }
        });
        </script>

        {% if show_config %}
        <!-- Bloque de Configuración -->
        <div class="balance-box" style="background:#fffde7;">
            <b>Opciones de seguridad:</b><br>
            <ul style="margin:8px 0 0 18px;padding:0;font-size:1em;">
                <li><b>Contraseña:</b> <span style="color:#388e3c;">Protegida</span></li>
                <li><b>Dispositivo vinculado:</b> <span style="color:#388e3c;">Sí</span></li>
                <li><b>Recuperación:</b> Guarda tu clave secreta (mnemonic) en un lugar seguro.</li>
            </ul>
        </div>
        <form method="post" action="/configuracion" class="mnemonic-actions">
            <button type="submit" name="show_mnemonic" style="background:#388e3c;">Mostrar clave secreta</button>
            <button type="button" onclick="copiarClave()" style="background:#1976d2;">Copiar clave</button>
            <button type="button" onclick="exportarClave()" style="background:#ffa000;">Exportar clave</button>
        </form>
        {% if mnemonic %}
        <div class="balance-box" id="mnemonic-box" style="background:#e3f2fd;word-break:break-all;"><b>Clave secreta:</b><br><span id="mnemonic">{{ mnemonic }}</span></div>
        {% endif %}
        <form method="post" action="/configuracion" style="margin-bottom:10px;">
            <input type="password" name="old_password" placeholder="Contraseña actual" required>
            <input type="password" name="new_password" placeholder="Nueva contraseña" required>
            <button type="submit" name="change_password" style="background:#ffa000;">Cambiar contraseña</button>
        </form>
        <form method="post" action="/configuracion" class="theme-switch">
            <button type="submit" name="theme" value="light" style="background:#43a047;">Tema claro</button>
            <button type="submit" name="theme" value="dark" style="background:#263238;">Tema oscuro</button>
        </form>
        <form method="post" action="/logout">
            <button type="submit"><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</button>
        </form>
        <a href="/" style="color:#1976d2;text-decoration:underline;">&larr; Volver a la wallet</a>
        <script>
        function copiarClave() {
            var mnemonic = document.getElementById('mnemonic');
            if (mnemonic) {
                navigator.clipboard.writeText(mnemonic.innerText);
                alert('Clave secreta copiada al portapapeles');
            } else {
                alert('Primero haz clic en "Mostrar clave secreta".');
            }
        }
        function exportarClave() {
            var mnemonic = document.getElementById('mnemonic');
            if (mnemonic) {
                var blob = new Blob([mnemonic.innerText], {type: 'text/plain'});
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'mnemonic.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Primero haz clic en "Mostrar clave secreta".');
            }
        }
        </script>
        {% endif %}
        <div class="balance-box"><b>Saldo Ecocoin:</b> {{ balances.eco }} <i class="fa-solid fa-coins" style="color:#43a047;"></i></div>
        <div class="balance-box" style="background:#fffde7;"><b>Saldo Bitcoin:</b> {{ balances.btc }} <i class="fa-brands fa-btc" style="color:#f7931a;"></i></div>
        <div class="balance-box" style="background:#e3f2fd;"><b>Saldo Ethereum:</b> {{ balances.eth }} <i class="fa-brands fa-ethereum" style="color:#3c3c3d;"></i></div>
        <div class="balance-box" style="background:#f1f8e9;"><b>Saldo Tether:</b> {{ balances.usdt }} <i class="fa-solid fa-dollar-sign" style="color:#26a69a;"></i></div>
        <div style="margin:18px 0 0 0;">
            <b>Historial de transacciones</b>
            <div style="max-height:180px;overflow-y:auto;background:#f9fbe7;border-radius:8px;padding:8px 6px 8px 12px;margin-top:6px;">
                {% if transactions and transactions|length > 0 %}
                    <ul style="list-style:none;padding:0;margin:0;">
                    {% for tx in transactions %}
                        <li style="margin-bottom:7px;font-size:0.98em;">
                            <span style="color:#388e3c;font-weight:bold;">{{ tx[4]|upper }}</span>
                            {% if tx[1] == session.device_id %}
                                <span style="color:#b71c1c;">Enviado</span> →
                                <span style="color:#1976d2;">{{ tx[2][:8] }}...</span>
                                <b>-{{ tx[3] }}</b>
                            {% else %}
                                <span style="color:#388e3c;">Recibido</span> ←
                                <span style="color:#1976d2;">{{ tx[1][:8] }}...</span>
                                <b>+{{ tx[3] }}</b>
                            {% endif %}
                            <span style="float:right;color:#888;font-size:0.93em;">{{ tx[5] }}</span>
                        </li>
                    {% endfor %}
                    </ul>
                {% else %}
                    <span style="color:#888;">No hay transacciones recientes.</span>
                {% endif %}
            </div>
        </div>
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
        <form method="post" action="/eliminar_todos" onsubmit="return confirm('¿Seguro que deseas eliminar TODOS los usuarios y balances? Esta acción es irreversible.');">
            <button type="submit" style="background:#b71c1c;">Eliminar TODOS los usuarios</button>
        </form>
        <script>
        function copiarClave() {
            var mnemonic = document.getElementById('mnemonic');
            if (mnemonic) {
                navigator.clipboard.writeText(mnemonic.innerText);
                alert('Clave secreta copiada al portapapeles');
            } else {
                alert('Primero haz clic en "Mostrar clave secreta".');
            }
        }
        function exportarClave() {
            var mnemonic = document.getElementById('mnemonic');
            if (mnemonic) {
                var blob = new Blob([mnemonic.innerText], {type: 'text/plain'});
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'mnemonic.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Primero haz clic en "Mostrar clave secreta".');
            }
        }
        </script>
    </div>
    {% endif %}
</body>
</html>
'''
