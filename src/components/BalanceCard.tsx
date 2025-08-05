import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";

export const BalanceCard: React.FC = () => {
  const { account, loginType, jwt } = useWallet();
  const [balance, setBalance] = useState<string>("0.000");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      let url = `/api/wallet/balance/${account}`;
      const headers: Record<string, string> = {};
      if (loginType === "custodial" && jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
      }
      const res = await fetch(url, { headers });
      const data = await res.json();
      setBalance(data.balance || "0.000");
    };
    fetchBalance();
  }, [account, loginType, jwt]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-gray-500 text-xs">Balance</div>
      <div className="text-2xl font-bold">{balance} ECO</div>
    </div>
  );
};