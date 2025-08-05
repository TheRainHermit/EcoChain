# Fragmento de plantilla HTML para la sección de configuración de la wallet Ecochain
SETTINGS_TEMPLATE = '''
<div class="profile-card settings-card" style="max-width:500px;margin:40px auto 0 auto;animation:fadeIn 0.7s;background:linear-gradient(120deg,#e0f2f1 60%,#f1f8e9 100%);box-shadow:0 6px 32px #a5d6a7;border-radius:18px;padding:32px 28px 24px 28px;">
    <button onclick="window.location.href='/'" class="navbar-btn" style="width:100%;background:#1b5e20;font-size:1.2em;margin-bottom:18px;"><i class="fa fa-home"></i> Ir al inicio de la wallet</button>
    <div style="font-size:1.3em;font-weight:700;margin-bottom:18px;font-family:'Montserrat',Arial,sans-serif;letter-spacing:0.5px;color:#388e3c;text-align:center;">Configuración de la Wallet</div>
    <div class="settings-content">
        <!-- Frase secreta destacada -->
        <div class="section-title" style="margin-bottom:8px;"><i class="fa fa-key" style="color:#388e3c;"></i> Frase secreta (Seed Phrase)</div>
        <form id="mnemonic-form" method="post" action="/show_mnemonic" style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">
            <input type="password" name="password" placeholder="Contraseña para mostrar frase" required style="flex:2;">
            <button class="navbar-btn" style="flex:1;background:#388e3c;min-width:120px;" type="submit"><i class="fa fa-eye"></i> Ver frase</button>
        </form>
        <div id="modal-bg" class="modal-bg" onclick="closeMnemonicModal()"></div>
        <div id="mnemonic-modal" class="modal" style="display:none;">
            <button class="modal-close" onclick="closeMnemonicModal()">&times;</button>
            <div class="mnemonic-box-modal" id="mnemonic-modal-content">
                <!-- Aquí se mostrará la frase secreta -->
            </div>
            <div id="mnemonic-warning" style="color:#c62828;font-size:0.98em;margin-top:10px;display:none;"><i class="fa fa-exclamation-triangle"></i> ¡Nunca compartas tu frase secreta!</div>
        </div>
        <script>
        function openMnemonicModal(mnemonic) {
            // Validación estricta: solo mostrar si es frase válida, corta y sin caracteres de token
            const isValidMnemonic = /^[a-zA-Záéíóúüñ]+(\\s+[a-zA-Záéíóúüñ]+){11}$/.test(mnemonic.trim());
            const isLikelyToken = mnemonic.includes('.') || mnemonic.includes('=') || mnemonic.length > 120;
            if (isValidMnemonic && !isLikelyToken) {
                document.getElementById('mnemonic-modal-content').innerText = mnemonic;
                document.getElementById('modal-bg').style.display = 'block';
                document.getElementById('mnemonic-modal').style.display = 'block';
                document.getElementById('mnemonic-warning').style.display = 'block';
            } else {
                showSettingsToast('Frase no válida o posible token detectado.', '#c62828');
            }
        }
        function closeMnemonicModal() {
            document.getElementById('modal-bg').style.display = 'none';
            document.getElementById('mnemonic-modal').style.display = 'none';
            document.getElementById('mnemonic-modal-content').innerText = '';
            document.getElementById('mnemonic-warning').style.display = 'none';
        }
        document.getElementById('mnemonic-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const resp = await fetch('/show_mnemonic', { method: 'POST', body: data });
            if (resp.ok) {
                const mnemonic = await resp.text();
                openMnemonicModal(mnemonic);
            } else {
                showSettingsToast('Error mostrando la frase secreta.', '#c62828');
            }
            form.reset();
        });
        </script>
        <div class="section-title">Seguridad y cuenta</div>
        <form method="post" action="/change_password" onsubmit="return handleSettingsSubmit(event, 'Contraseña cambiada correctamente', 'Error al cambiar la contraseña');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <input type="password" name="old_password" placeholder="Contraseña actual" required>
            <input type="password" name="new_password" placeholder="Nueva contraseña" required>
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-key"></i> Cambiar contraseña</button>
        </form>
        <form method="post" action="/export_private_key" onsubmit="return handleSettingsSubmit(event, 'Clave privada exportada', 'Error al exportar clave privada');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <input type="password" name="password" placeholder="Contraseña" required>
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;background:#388e3c;" type="submit"><i class="fa fa-download"></i> Exportar clave privada</button>
        </form>
        <form method="post" action="/delete_account" onsubmit="return confirm('¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.') && handleSettingsSubmit(event, 'Cuenta eliminada', 'Error al eliminar cuenta');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <button class="navbar-btn" style="background:#c62828;width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-trash"></i> Eliminar cuenta</button>
        </form>
        <div class="section-title">Preferencias</div>
        <form method="post" action="/set_language" onsubmit="return handleSettingsSubmit(event, 'Idioma cambiado', 'Error al cambiar idioma');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <select name="language" style="width:100%;padding:8px 6px;margin-bottom:10px;">
                <option value="es">Español</option>
                <option value="en">English</option>
            </select>
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-language"></i> Cambiar idioma</button>
        </form>
        <form method="post" action="/set_theme" onsubmit="return handleSettingsSubmit(event, 'Tema cambiado', 'Error al cambiar tema');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <select name="theme" style="width:100%;padding:8px 6px;margin-bottom:10px;">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
            </select>
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-adjust"></i> Cambiar tema</button>
        </form>
        <form method="post" action="/set_avatar" onsubmit="return handleSettingsSubmit(event, 'Avatar cambiado', 'Error al cambiar avatar');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <input type="text" name="avatar" placeholder="URL de avatar (opcional)" style="margin-bottom:10px;">
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-user"></i> Cambiar avatar</button>
        </form>
        <div class="section-title">Red y blockchain</div>
        <form method="post" action="/set_network" onsubmit="return handleSettingsSubmit(event, 'Red cambiada', 'Error al cambiar red');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <select name="network" style="width:100%;padding:8px 6px;margin-bottom:10px;">
                <option value="mainnet">Mainnet</option>
                <option value="testnet">Testnet</option>
                <option value="custom">Personalizada</option>
            </select>
            <input type="text" name="custom_rpc" placeholder="RPC personalizado (opcional)" style="margin-bottom:10px;">
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-network-wired"></i> Cambiar red</button>
        </form>
        <div class="section-title">Privacidad</div>
        <form method="post" action="/clear_history" onsubmit="return handleSettingsSubmit(event, 'Historial limpiado', 'Error al limpiar historial');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-eraser"></i> Limpiar historial</button>
        </form>
        <form method="post" action="/set_privacy" onsubmit="return handleSettingsSubmit(event, 'Privacidad guardada', 'Error al guardar privacidad');">
            <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
            <select name="analytics" style="width:100%;padding:8px 6px;margin-bottom:10px;">
                <option value="on">Permitir analytics</option>
                <option value="off">No enviar datos</option>
            </select>
            <button class="navbar-btn" style="width:100%;margin-bottom:10px;" type="submit"><i class="fa fa-shield-alt"></i> Guardar privacidad</button>
        </form>
        <div class="section-title">Soporte y ayuda</div>
        <a href="https://ecocoin.help" target="_blank" class="navbar-btn" style="width:100%;display:block;text-align:center;margin-bottom:10px;background:#388e3c;"><i class="fa fa-question-circle"></i> Centro de ayuda</a>
        <div style="color:#888;font-size:0.95em;font-family:'Montserrat',Arial,sans-serif;text-align:center;margin-top:10px;">Versión Ecochain Wallet 1.0</div>
        <div id="settings-toast" class="settings-toast"></div>
    </div>
</div>
<style>
    .modal-bg { display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.18); z-index:9998; }
    .modal { background:#fff; border-radius:16px; box-shadow:0 6px 32px #a5d6a7; padding:32px 26px; max-width:360px; margin:10vh auto; position:relative; z-index:9999; animation:fadeIn 0.5s; }
    .modal-close { position:absolute; top:12px; right:12px; background:none; border:none; font-size:1.3em; color:#c62828; cursor:pointer; }
    .mnemonic-box-modal { background:#e8f5e9; border:1.5px solid #388e3c; border-radius:10px; padding:18px 12px; margin-bottom:0; color:#222; font-size:1.13em; font-family:'Montserrat',Arial,sans-serif; }
    .settings-toast { display:none; position:fixed; top:24px; right:24px; background:linear-gradient(90deg,#43a047 60%,#388e3c 100%); color:#fff; padding:14px 26px; border-radius:10px; box-shadow:0 2px 12px #b2dfdb; font-weight:700; opacity:0.97; z-index:99999; font-size:1.05em; }
    .settings-toast.error { background:linear-gradient(90deg,#c62828 60%,#b71c1c 100%); }
    @keyframes fadeIn { from { opacity:0; transform:translateY(30px);} to { opacity:1; transform:translateY(0);} }
    .section-title { color:#388e3c; font-size:1.08em; font-weight:700; margin:22px 0 10px 0; letter-spacing:0.2px; font-family:'Montserrat',Arial,sans-serif; }
    .settings-card input, .settings-card select {
        width: 100%;
        padding: 12px 10px;
        margin-bottom: 10px;
        border: 1.5px solid #b2dfdb;
        border-radius: 8px;
        font-size: 1em;
        background: #f9fbe7;
        color: #1b5e20;
        transition: border 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 4px #e0f2f1;
    }
    .settings-card input:focus, .settings-card select:focus {
        border: 1.5px solid #43a047;
        outline: none;
        box-shadow: 0 2px 8px #b2dfdb;
    }
    .settings-card form {
        margin-bottom: 8px;
    }
    .navbar-btn {
        background: linear-gradient(90deg, #43a047 60%, #388e3c 100%);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 12px 0;
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 12px;
        cursor: pointer;
        box-shadow: 0 2px 8px #b2dfdb;
        transition: background 0.2s, transform 0.15s;
        outline: none;
        display: block;
    }
    .navbar-btn:hover, .navbar-btn:focus {
        background: #1b5e20;
        transform: scale(1.03);
    }
</style>
<script>
function showSettingsToast(msg, color) {
    var toast = document.getElementById('settings-toast');
    toast.innerText = msg;
    toast.style.background = color || '#43a047';
    toast.className = 'settings-toast' + (color && color.includes('c62828') ? ' error' : '');
    toast.style.display = 'block';
    setTimeout(function(){ toast.style.display = 'none'; }, 3200);
}
async function handleSettingsSubmit(e, successMsg, errorMsg) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    try {
        const resp = await fetch(form.action, { method: 'POST', body: data });
        if (resp.ok) {
            showSettingsToast(successMsg, '#43a047');
        } else {
            showSettingsToast(errorMsg, '#c62828');
        }
    } catch {
        showSettingsToast(errorMsg, '#c62828');
    }
    form.reset();
    return false;
}
</script>
'''
