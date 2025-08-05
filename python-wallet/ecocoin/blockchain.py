"""
Módulo principal de la blockchain Ecocoin.
"""
import time
from typing import List, Dict, Any, Optional
from .block import Block
from .transaction import Transaction
from .contract import SmartContract, Token, NFT

class Blockchain:
    """
    Clase principal de la blockchain Ecocoin.
    Gestiona bloques, transacciones, contratos, tokens, NFTs y permisos.
    """
    def __init__(self):
        self.chain: List[Block] = [self.create_genesis_block()]
        self.difficulty: int = 2
        self.pending_transactions: List[Transaction] = []
        self.mining_reward: float = 100
        self._private_mining_key: str = "clave-secreta"
        self.contracts: List[SmartContract] = []
        self.tokens: Dict[str, Token] = {}
        self.nfts: Dict[str, NFT] = {}
        self.roles: Dict[str, str] = {'admin': 'admin'}

    def create_genesis_block(self) -> Block:
        return Block(0, "0", time.time(), [], 0)

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, sender: str, recipient: str, amount: float, signature: Optional[str] = None, public_key: Optional[str] = None) -> bool:
        tx = Transaction(sender, recipient, amount, signature, public_key)
        if sender not in ["Sistema", "PrivateGame"]:
            if not tx.verify_signature():
                print("Transacción rechazada: firma inválida.")
                return False
        self.pending_transactions.append(tx)
        return True

    def mine_pending_transactions(self, miner_address: str) -> bool:
        if not self.has_role(miner_address, 'minero') and not self.has_role(miner_address, 'admin'):
            print("Solo mineros o admin pueden minar.")
            return False
        if not self.pending_transactions:
            print("No hay transacciones para minar.")
            return False
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

    def proof_of_work(self, block: Block) -> None:
        while not block.hash.startswith('0' * self.difficulty):
            block.nonce += 1
            block.hash = block.calculate_hash()

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            if current.hash != current.calculate_hash():
                return False
            if current.previous_hash != previous.hash:
                return False
        return True

    def get_balance(self, address: str) -> float:
        balance = 0.0
        for block in self.chain:
            for tx in block.transactions:
                if tx.sender == address:
                    balance -= tx.amount
                if tx.recipient == address:
                    balance += tx.amount
        return balance

    def set_mining_reward(self, new_reward: float) -> None:
        self.mining_reward = new_reward
        print(f"Nueva recompensa de minado: {new_reward}")

    def add_contract(self, name: str, code: str) -> None:
        contract = SmartContract(name, code)
        self.contracts.append(contract)
        print(f"Contrato {name} agregado.")

    def execute_contracts(self, block: Block) -> None:
        for contract in self.contracts:
            contract.execute(self, block)

    def reward_for_private_game(self, user: str, amount: float, key: str) -> bool:
        if key != self._private_mining_key:
            print("Acceso denegado: clave incorrecta para minería privada.")
            return False
        reward_tx = Transaction("PrivateGame", user, amount)
        self.pending_transactions.append(reward_tx)
        print(f"Recompensa privada agregada para {user}: {amount} cripto.")
        return True

    # Permisos y roles
    def set_role(self, address: str, role: str, requester: str) -> bool:
        if self.roles.get(requester) != 'admin':
            print("Solo el admin puede asignar roles.")
            return False
        if role not in ['admin', 'minero', 'usuario']:
            print("Rol no válido.")
            return False
        self.roles[address] = role
        print(f"Rol {role} asignado a {address}.")
        return True

    def has_role(self, address: str, role: str) -> bool:
        return self.roles.get(address) == role

    # Tokens secundarios
    def create_token(self, name: str, symbol: str, total_supply: float, owner: str) -> bool:
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

    # NFTs
    def mint_nft(self, token_id: str, owner: str, metadata: Any) -> bool:
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

    def nft_owner(self, token_id: str) -> Optional[str]:
        nft = self.nfts.get(token_id)
        if not nft:
            return None
        return nft.owner

    def get_nfts_by_owner(self, address: str):
        """Devuelve una lista de NFTs cuyo owner es la dirección dada."""
        return [nft.__dict__ for nft in self.nfts.values() if nft.owner == address]

    def get_tx_history(self, address: str):
        """Devuelve el historial de transacciones donde la dirección es sender o recipient."""
        history = []
        for block in self.chain:
            for tx in block.transactions:
                if tx.sender == address or tx.recipient == address:
                    history.append(tx.__dict__)
        return history

    def get_all_balances(self, address: str):
        """Devuelve un diccionario con el balance de cada token y el balance principal."""
        balances = {'eco': self.get_balance(address)}
        for symbol, token in self.tokens.items():
            balances[symbol.lower()] = token.balance_of(address)
        return balances
