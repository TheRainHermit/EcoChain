"""
Módulo de modelos de transacción para Ecocoin Blockchain.
"""
import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.exceptions import InvalidSignature
from typing import Optional

class Transaction:
    """
    Representa una transacción firmada digitalmente en la blockchain.
    """
    def __init__(self, sender: str, recipient: str, amount: float, signature: Optional[str] = None, public_key: Optional[str] = None):
        self.sender = sender
        self.recipient = recipient
        self.amount = amount
        self.signature = signature
        self.public_key = public_key

    def __repr__(self):
        return f"<Transaction from={self.sender} to={self.recipient} amount={self.amount}>"

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
