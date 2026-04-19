'use client';
import { useState } from 'react';
import { ScoreResult } from '@/lib/types';

interface Props {
  result: ScoreResult;
  scoreId: string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export default function SealButton({ result }: Props) {
  const [state, setState] = useState<'idle' | 'connecting' | 'pending' | 'done' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (result.sealTx || (state === 'done' && txHash)) {
    const hash = txHash || result.sealTx!;
    return (
      <a
        href={`https://bscscan.com/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[var(--surface)] border border-green-700 text-green-400 font-bold py-4 rounded-lg text-center transition-colors hover:border-green-500"
      >
        🔒 Sealed on BSC · View Proof
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
        body: JSON.stringify({
          name: result.concept.name,
          description: result.concept.description,
          score: result.total,
        }),
      });

      if (!res.ok) throw new Error('Failed to build seal transaction');
      const { to, data } = await res.json();

      setState('pending');

      const hash = (await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: accounts[0], to, data, chainId: '0x38' }],
      })) as string;

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
        className="w-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg text-center transition-colors"
      >
        {state === 'connecting' && 'Connecting wallet...'}
        {state === 'pending' && 'Confirm in MetaMask...'}
        {(state === 'idle' || state === 'error') && '🔒 Seal on BSC (~$0.02)'}
      </button>
      {state === 'error' && errorMsg && (
        <p className="text-red-400 text-xs text-center">{errorMsg}</p>
      )}
    </div>
  );
}
