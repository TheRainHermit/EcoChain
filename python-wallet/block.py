import hashlib
import time
from typing import List
from transaction import Transaction

class Block:
    """
    Representa un bloque de la blockchain.
    """
    def __init__(self, index: int, previous_hash: str, timestamp: float, transactions: List[Transaction], nonce: int = 0):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.transactions = transactions
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        transactions_str = ''.join([str(tx) for tx in self.transactions])
        block_string = f"{self.index}{self.previous_hash}{self.timestamp}{transactions_str}{self.nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()
