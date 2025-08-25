from flask import Flask
from wallet.routes import bp

app = Flask(__name__)
app.secret_key = 'supersecret'
app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(debug=True)
