import jwt
from flask import request, jsonify
JWT_SECRET = 'supersecret'  # Usa el mismo secreto que el backend

def jwt_required(f):
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth or not auth.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        token = auth.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.user = payload
        except Exception:
            return jsonify({'error': 'Invalid token'}), 403
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper