class SmartContract:
    """
    Contrato inteligente simple: ejecuta lógica programable al minar un bloque.
    """
    def __init__(self, name: str, code: str):
        self.name = name
        self.code = code  # Código Python como string

    def execute(self, blockchain, block):
        local_vars = {'blockchain': blockchain, 'block': block}
        try:
            exec(self.code, {}, local_vars)
        except Exception as e:
            print(f"Error ejecutando contrato {self.name}: {e}")

class Token:
    """
    Representa un token secundario (fungible) en la blockchain.
    """
    def __init__(self, name: str, symbol: str, total_supply: float):
        self.name = name
        self.symbol = symbol
        self.total_supply = total_supply
        self.balances = {}  # address -> balance

    def mint(self, address: str, amount: float):
        self.balances[address] = self.balances.get(address, 0) + amount
        self.total_supply += amount

    def transfer(self, sender: str, recipient: str, amount: float) -> bool:
        if self.balances.get(sender, 0) < amount:
            return False
        self.balances[sender] -= amount
        self.balances[recipient] = self.balances.get(recipient, 0) + amount
        return True

    def balance_of(self, address: str) -> float:
        return self.balances.get(address, 0)

class NFT:
    """
    Representa un token no fungible (NFT) único en la blockchain.
    """
    def __init__(self, token_id: str, owner: str, metadata: dict):
        self.token_id = token_id
        self.owner = owner
        self.metadata = metadata  # Puede incluir nombre, descripción, URL, etc.

    def transfer(self, new_owner: str):
        self.owner = new_owner
