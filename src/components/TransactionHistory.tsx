import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";

export const TransactionHistory: React.FC = () => {
  const { account, loginType, jwt } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTx = async () => {
      if (!account) return;
      let url = `/api/wallet/transactions/${account}`;
      const headers: Record<string, string> = {};
      if (loginType === "custodial" && jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
      }
      const res = await fetch(url, { headers });
      const data = await res.json();
      setTransactions(data || []);
    };
    fetchTx();
  }, [account, loginType, jwt]);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <div className="text-gray-500 text-xs mb-2">Historial de transacciones</div>
      <ul>
        {transactions.map((tx, i) => (
          <li key={i} className="text-sm border-b py-1">
            {tx.type} - {tx.amount} ECO - {tx.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};