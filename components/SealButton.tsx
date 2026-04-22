'use client';
import { useEffect, useState } from 'react';

interface Props {
  scoreId: string;
}

function getStoredSealKey(scoreId: string): string {
  return `4racle:seal:${scoreId}`;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export default function SealButton({ scoreId }: Props) {
  const [state, setState] = useState<'idle' | 'connecting' | 'pending' | 'done' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedTxHash = window.localStorage.getItem(getStoredSealKey(scoreId));

    if (storedTxHash) {
      setTxHash(storedTxHash);
      setState('done');
    }
  }, [scoreId]);

  if (state === 'done' && txHash) {
    const hash = txHash;
    return (
      <a
        href={`https://bscscan.com/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary !border-green-700/40 !text-green-400 hover:!border-green-500/60"
      >
        Sealed on BSC &middot; View Proof
      </a>
    );
  }

  async function handleSeal() {
    if (!window.ethereum) {
      setErrorMsg('MetaMask not detected. Install MetaMask to seal on BSC.');
      setState('error');
      return;
    }

    setState('connecting');
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts.length) throw new Error('No accounts returned from wallet');

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
      } catch {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x38',
            chainName: 'BNB Smart Chain',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls: ['https://bscscan.com/'],
          }],
        });
      }

      const res = await fetch('/api/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoreId }),
      });

      if (!res.ok) throw new Error('Failed to build seal transaction');
      const { to, data } = await res.json();

      setState('pending');

      const hash = (await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: accounts[0], to, data, chainId: '0x38' }],
      })) as string;

      window.localStorage.setItem(getStoredSealKey(scoreId), hash);
      setTxHash(hash);
      setState('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Transaction failed');
      setState('error');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSeal}
        disabled={state === 'connecting' || state === 'pending'}
        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'connecting' && 'Connecting wallet...'}
        {state === 'pending' && 'Confirm in MetaMask...'}
        {(state === 'idle' || state === 'error') && 'Seal on BSC (~$0.02)'}
      </button>
      {state === 'error' && errorMsg && (
        <p className="text-red-400 text-xs text-center">{errorMsg}</p>
      )}
    </div>
  );
}
