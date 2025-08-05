import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.exceptions import InvalidSignature

class Transaction:
    """
    Representa una transacción firmada digitalmente en la blockchain.
    """
    def __init__(self, sender: str, recipient: str, amount: float, signature: str = None, public_key: str = None):
        self.sender = sender
        self.recipient = recipient
        self.amount = amount
        self.signature = signature  # Firma digital en base64
        self.public_key = public_key  # Clave pública en PEM (solo para usuarios)

    def __repr__(self):
        return f"{{'from': '{self.sender}', 'to': '{self.recipient}', 'amount': {self.amount}, 'signature': {self.signature}}}"

    def to_message(self) -> str:
        return f"{self.sender}:{self.recipient}:{self.amount}"

    def sign(self, private_key) -> None:
        message = self.to_message().encode()
        signature = private_key.sign(
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        self.signature = base64.b64encode(signature).decode()

    def verify_signature(self) -> bool:
        if not self.signature or not self.public_key:
            return False
        try:
            public_key = serialization.load_pem_public_key(self.public_key.encode())
            public_key.verify(
                base64.b64decode(self.signature),
                self.to_message().encode(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except Exception:
            return False
