"""
Definición de la criptomoneda Ecocoin (símbolo: ♻️) para la blockchain Ecocoin.
No está asignada a ningún usuario por defecto.
"""
from ecocoin.contract import Token

def create_ecocoin():
    name = "Ecocoin"
    symbol = "♻️"  # Símbolo de reciclaje
    total_supply = 1000000  # Puedes ajustar el suministro total
    token = Token(name, symbol, total_supply)
    print(f"Token creado: {token.name} ({token.symbol}), suministro total: {token.total_supply}")
    return token

if __name__ == "__main__":
    create_ecocoin()
