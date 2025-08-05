import requests
import time

API_URL = 'http://127.0.0.1:5000'

def test_add_transaction():
    data = {
        'sender': 'admin',
        'recipient': 'usuario1',
        'amount': 10,
        'signature': None,
        'public_key': None
    }
    r = requests.post(f'{API_URL}/add_transaction', json=data)
    print('Add transaction:', r.status_code, r.text)

def test_mine():
    data = {'miner': 'admin'}
    r = requests.post(f'{API_URL}/mine', json=data)
    print('Mine block:', r.status_code, r.text)

def test_balance(address):
    r = requests.get(f'{API_URL}/balance/{address}')
    print(f'Balance {address}:', r.status_code, r.json())

def test_chain():
    r = requests.get(f'{API_URL}/chain')
    print('Chain:', r.status_code)
    print(r.json())

def test_token():
    # Crear token
    data = {'name': 'TestToken', 'symbol': 'TT', 'total_supply': 1000, 'owner': 'admin'}
    r = requests.post(f'{API_URL}/create_token', json=data)
    print('Create token:', r.status_code, r.text)
    # Transferir token
    data = {'symbol': 'TT', 'sender': 'admin', 'recipient': 'usuario1', 'amount': 100}
    r = requests.post(f'{API_URL}/transfer_token', json=data)
    print('Transfer token:', r.status_code, r.text)
    # Consultar balances
    r = requests.get(f'{API_URL}/token_balance/TT/admin')
    print('Token balance admin:', r.status_code, r.json())
    r = requests.get(f'{API_URL}/token_balance/TT/usuario1')
    print('Token balance usuario1:', r.status_code, r.json())

def test_nft():
    # Crear NFT
    data = {'token_id': 'nft1', 'owner': 'admin', 'metadata': {'name': 'NFT de prueba', 'desc': 'Un NFT de ejemplo'}}
    r = requests.post(f'{API_URL}/mint_nft', json=data)
    print('Mint NFT:', r.status_code, r.text)
    # Transferir NFT
    data = {'token_id': 'nft1', 'new_owner': 'usuario1'}
    r = requests.post(f'{API_URL}/transfer_nft', json=data)
    print('Transfer NFT:', r.status_code, r.text)
    # Consultar dueño
    r = requests.get(f'{API_URL}/nft_owner/nft1')
    print('NFT owner:', r.status_code, r.json())

def test_contract():
    # Agregar contrato que imprime mensaje al minar
    code = "print('Contrato ejecutado: bloque minado', block.index)"
    data = {'name': 'TestContract', 'code': code}
    r = requests.post(f'{API_URL}/add_contract', json=data)
    print('Add contract:', r.status_code, r.text)
    # Minar para ejecutar contrato
    data = {'miner': 'admin'}
    r = requests.post(f'{API_URL}/mine', json=data)
    print('Mine block (contract):', r.status_code, r.text)

def run_all():
    print('--- Prueba de blockchain Ecocoin ---')
    test_add_transaction()
    time.sleep(1)
    test_mine()
    time.sleep(1)
    test_balance('admin')
    test_balance('usuario1')
    test_chain()
    print('\n--- Prueba de tokens ---')
    test_token()
    print('\n--- Prueba de NFT ---')
    test_nft()
    print('\n--- Prueba de contrato inteligente ---')
    test_contract()

if __name__ == '__main__':
    run_all()
