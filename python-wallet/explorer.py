from ecocoin.blockchain import Blockchain
import requests
from tabulate import tabulate

API_URL = 'http://127.0.0.1:5000'
blockchain = Blockchain()

def print_chain():
    resp = requests.get(f'{API_URL}/chain')
    data = resp.json()
    print(f"Longitud de la cadena: {data['length']}")
    for block in data['chain']:
        print(f"Bloque #{block['index']} | Hash: {block['hash']}")
        print(f"  Transacciones:")
        for tx in block['transactions']:
            print(f"    {tx}")
        print("-")

def print_balance(address):
    resp = requests.get(f'{API_URL}/balance/{address}')
    data = resp.json()
    print(f"Balance de {address}: {data['balance']}")

if __name__ == '__main__':
    print("Explorador CLI de la blockchain Ecocoin")
    print("1. Ver cadena completa")
    print("2. Consultar balance de una dirección")
    op = input("Opción: ")
    if op == '1':
        print_chain()
    elif op == '2':
        addr = input("Dirección: ")
        print_balance(addr)
    else:
        print("Opción no válida")
