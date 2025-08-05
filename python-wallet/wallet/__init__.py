# Inicialización del módulo wallet web Ecocoin
from flask import Flask
from .routes import bp
from flask_wtf import CSRFProtect

app = Flask(__name__)
app.secret_key = 'cambia-esto-por-un-secreto-seguro'
app.config['WTF_CSRF_ENABLED'] = True
# Configuración de cookies seguras y SameSite
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
csrf = CSRFProtect(app)
app.register_blueprint(bp)

# Puedes agregar aquí más inicialización si es necesario
