from ecocoin.blockchain import Blockchain

global_blockchain = Blockchain()

def get_eco_balance(address):
    try:
        return global_blockchain.get_balance(address)
    except Exception:
        return 0

def recargar_eco(dest_address, amount=10000):
    global_blockchain.add_transaction('Sistema', dest_address, amount)
    global_blockchain.mine_pending_transactions('Sistema')

def transfer_eco(sender, recipient, amount):
    global_blockchain.add_transaction(sender, recipient, float(amount))
    global_blockchain.mine_pending_transactions(sender)

# Nueva función: inicializar saldo al crear wallet

def inicializar_wallet_en_blockchain(address, saldo_inicial=0):
    if saldo_inicial > 0:
        recargar_eco(address, saldo_inicial)
