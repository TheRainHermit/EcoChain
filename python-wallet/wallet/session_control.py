from flask.sessions import SecureCookieSessionInterface

class InternalSessionInterface(SecureCookieSessionInterface):
    def save_session(self, app, session, response):
        # Nunca guardar la cookie de sesión en la respuesta (ni siquiera como vacía)
        return
