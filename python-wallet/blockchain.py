import hashlib
import time
from typing import List
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.exceptions import InvalidSignature
import base64
from block import Block
from transaction import Transaction
from contract import SmartContract, Token, NFT
from web3 import Web3
from eth_account import Account

class Blockchain:
    def __init__(self):
        """
        Inicializa la blockchain con el bloque génesis y estructuras principales.
        """
        self.chain: List[Block] = [self.create_genesis_block()]
        self.difficulty: int = 2
        self.pending_transactions: List[Transaction] = []
        self.mining_reward: float = 100.0  # Recompensa por minar un bloque
        self.contracts: List[SmartContract] = []
        self.tokens: dict = {}  # symbol -> Token
        self.roles: dict = {}  # address -> role (admin, minero, usuario)
        self.nfts: dict = {}  # token_id -> NFT
        self.web3 = Web3(Web3.EthereumTesterProvider())
        self.admin_address = None

    def create_account(self) -> tuple:
        acct = Account.create()
        address = acct.address
        private_key = acct.key.hex()
        if self.admin_address is None:
            self.admin_address = address
            self.roles[address] = 'admin'
        else:
            self.roles[address] = 'usuario'
        return address, private_key

    def import_account(self, private_key_hex: str) -> tuple:
        acct = Account.from_key(private_key_hex)
        address = acct.address
        if address not in self.roles:
            self.roles[address] = 'usuario'
        return address, acct.key.hex()

    def get_eth_balance(self, address):
        try:
            return self.web3.eth.get_balance(address) / 1e18
        except Exception as e:
            print(f"Error al consultar balance ETH: {e}")
            return 0.0

    def create_genesis_block(self):
        return Block(0, "0", time.time(), [], 0)

    def get_latest_block(self):
        return self.chain[-1]

    def add_transaction(self, sender: str, recipient: str, amount: float, signature: str = None, public_key: str = None) -> bool:
        if sender not in ["Sistema", "PrivateGame"]:
            if self.get_balance(sender) < amount:
                print("Transacción rechazada: saldo insuficiente.")
                return False
        tx = Transaction(sender, recipient, amount, signature, public_key)
        if sender not in ["Sistema", "PrivateGame"]:
            if not tx.verify_signature():
                print("Transacción rechazada: firma inválida.")
                return False
        self.pending_transactions.append(tx)
        return True

    def add_contract(self, name, code):
        contract = SmartContract(name, code)
        self.contracts.append(contract)
        print(f"Contrato {name} agregado.")

    def execute_contracts(self, block):
        for contract in self.contracts:
            contract.execute(self, block)

    def mine_block(self):
        """
        Mina un nuevo bloque con las transacciones pendientes.
        Solo en memoria, no persiste en base de datos.
        """
        if not self.pending_transactions:
            print("No hay transacciones para minar.")
            return False
        previous_block = self.get_latest_block()
        new_block = Block(len(self.chain), previous_block.hash, time.time(), self.pending_transactions)
        self.proof_of_work(new_block)
        self.chain.append(new_block)
        self.pending_transactions = []
        print(f"Bloque {new_block.index} minado con éxito.")
        return True

    def mine_pending_transactions(self, miner_address: str) -> bool:
        """
        Mina las transacciones pendientes y otorga la recompensa al minero.
        Solo addresses con rol 'minero' o 'admin' pueden minar.
        """
        if not self.has_role(miner_address, 'minero') and not self.has_role(miner_address, 'admin'):
            print("Solo mineros o admin pueden minar.")
            return False
        if not self.pending_transactions:
            print("No hay transacciones para minar.")
            return False
        # Validar que el minero existe
        if miner_address not in self.roles:
            print("El minero no está registrado.")
            return False
        # Agregar la transacción de recompensa
        reward_tx = Transaction("Sistema", miner_address, self.mining_reward)
        transactions_to_mine = self.pending_transactions + [reward_tx]
        previous_block = self.get_latest_block()
        new_block = Block(len(self.chain), previous_block.hash, time.time(), transactions_to_mine)
        self.proof_of_work(new_block)
        self.chain.append(new_block)
        self.pending_transactions = []
        self.execute_contracts(new_block)
        print(f"Bloque {new_block.index} minado por {miner_address}.")
        return True

    def proof_of_work(self, block):
        while not block.hash.startswith('0' * self.difficulty):
            block.nonce += 1
            block.hash = block.calculate_hash()

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            if current.hash != current.calculate_hash():
                return False
            if current.previous_hash != previous.hash:
                return False
        return True

    def can_mine(self):
        """
        Indica si hay transacciones pendientes para minar.
        """
        return len(self.pending_transactions) > 0

    def reward_for_private_game(self, user: str, amount: float, admin_address: str) -> bool:
        """
        Recompensa a un usuario con criptomonedas por actividades privadas (ej: juegos).
        Solo accesible para el admin.
        """
        if not self.has_role(admin_address, 'admin'):
            print("Acceso denegado: solo el admin puede recompensar.")
            return False
        reward_tx = Transaction("PrivateGame", user, amount)
        self.pending_transactions.append(reward_tx)
        print(f"Recompensa privada agregada para {user}: {amount} cripto.")
        return True

    def set_mining_reward(self, new_reward: float):
        """
        Permite cambiar la recompensa de minado.
        """
        self.mining_reward = new_reward
        print(f"Nueva recompensa de minado: {new_reward}")

    def get_balance(self, address: str) -> float:
        """
        Calcula el balance de una dirección sumando y restando transacciones confirmadas.
        """
        balance = 0.0
        for block in self.chain:
            for tx in block.transactions:
                if tx.sender == address:
                    balance -= tx.amount
                if tx.recipient == address:
                    balance += tx.amount
        return balance

    def create_token(self, name: str, symbol: str, total_supply: float, owner: str):
        if symbol in self.tokens:
            print(f"El token {symbol} ya existe.")
            return False
        token = Token(name, symbol, total_supply)
        token.mint(owner, total_supply)
        self.tokens[symbol] = token
        print(f"Token {name} ({symbol}) creado y asignado a {owner}.")
        return True

    def transfer_token(self, symbol: str, sender: str, recipient: str, amount: float) -> bool:
        token = self.tokens.get(symbol)
        if not token:
            print(f"Token {symbol} no existe.")
            return False
        if not token.transfer(sender, recipient, amount):
            print(f"Transferencia de {amount} {symbol} fallida.")
            return False
        print(f"Transferencia de {amount} {symbol} de {sender} a {recipient} exitosa.")
        return True

    def token_balance_of(self, symbol: str, address: str) -> float:
        token = self.tokens.get(symbol)
        if not token:
            return 0.0
        return token.balance_of(address)

    def set_role(self, address: str, role: str, requester: str) -> bool:
        """
        Asigna un rol a una dirección. Solo el admin puede hacerlo.
        """
        if not self.has_role(requester, 'admin'):
            print("Solo el admin puede asignar roles.")
            return False
        if role not in ['admin', 'minero', 'usuario']:
            print("Rol no válido.")
            return False
        self.roles[address] = role
        print(f"Rol {role} asignado a {address}.")
        return True

    def has_role(self, address: str, role: str) -> bool:
        """
        Verifica si una dirección tiene un rol específico.
        """
        return self.roles.get(address) == role

    def mint_nft(self, token_id: str, owner: str, metadata: dict) -> bool:
        if token_id in self.nfts:
            print(f"El NFT {token_id} ya existe.")
            return False
        nft = NFT(token_id, owner, metadata)
        self.nfts[token_id] = nft
        print(f"NFT {token_id} creado y asignado a {owner}.")
        return True

    def transfer_nft(self, token_id: str, new_owner: str) -> bool:
        nft = self.nfts.get(token_id)
        if not nft:
            print(f"NFT {token_id} no existe.")
            return False
        nft.transfer(new_owner)
        print(f"NFT {token_id} transferido a {new_owner}.")
        return True

    def nft_owner(self, token_id: str) -> str:
        nft = self.nfts.get(token_id)
        if not nft:
            return None
        return nft.owner

    def get_nfts_by_owner(self, address: str):
        return [nft.__dict__ for nft in self.nfts.values() if nft.owner == address]

    def get_tx_history(self, address: str):
        history = []
        for block in self.chain:
            for tx in block.transactions:
                if tx.sender == address or tx.recipient == address:
                    history.append(tx.__dict__)
        return history

    def get_all_balances(self, address: str):
        balances = {'eco': self.get_balance(address)}
        for symbol, token in self.tokens.items():
            balances[symbol.lower()] = token.balance_of(address)
        return balances

if __name__ == "__main__":
    blockchain = Blockchain()
    # Ejemplo: crear cuentas y transacciones, minar y mostrar en consola

    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization

    # Generar claves para Alice, Bob y Charlie
    alice_private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    alice_public_key = alice_private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    bob_private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    bob_public_key = bob_private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    charlie_private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    charlie_public_key = charlie_private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    from transaction import Transaction
    # Crear y firmar transacción de Alice a Bob
    tx1 = Transaction("Alice", "Bob", 50, public_key=alice_public_key)
    tx1.sign(alice_private_key)
    blockchain.add_transaction("Alice", "Bob", 50, signature=tx1.signature, public_key=alice_public_key)

    # Crear y firmar transacción de Bob a Charlie
    tx2 = Transaction("Bob", "Charlie", 25, public_key=bob_public_key)
    tx2.sign(bob_private_key)
    blockchain.add_transaction("Bob", "Charlie", 25, signature=tx2.signature, public_key=bob_public_key)

    # Crear y firmar transacción de Charlie a Alice
    tx3 = Transaction("Charlie", "Alice", 10, public_key=charlie_public_key)
    tx3.sign(charlie_private_key)
    blockchain.add_transaction("Charlie", "Alice", 10, signature=tx3.signature, public_key=charlie_public_key)

    # Asignar rol de minero a Miner1 para poder minar
    blockchain.set_role("Miner1", "minero", "admin")

    # Minar las transacciones pendientes (solo en memoria)
    blockchain.mine_pending_transactions("Miner1")

    for block in blockchain.chain:
        print(f"Índice: {block.index}")
        print(f"Hash previo: {block.previous_hash}")
        print(f"Hash: {block.hash}")
        print(f"Transacciones: {block.transactions}")
        print(f"Nonce: {block.nonce}")
        print(f"Timestamp: {block.timestamp}")
        print("-")

    print("¿La cadena es válida?", blockchain.is_chain_valid())
