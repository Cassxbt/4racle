import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const ABI = [
  'function sealScore(bytes32 conceptHash, uint8 score) external returns (uint256 id)',
];

export async function POST(req: NextRequest) {
  let body: { name: string; description: string; score: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, description, score } = body;
  if (!name || !description || typeof score !== 'number') {
    return NextResponse.json({ error: 'name, description, score required' }, { status: 400 });
  }
  if (score < 0 || score > 100) {
    return NextResponse.json({ error: 'score must be 0-100' }, { status: 400 });
  }

  const conceptHash = ethers.keccak256(ethers.toUtf8Bytes(name + description));
  const iface = new ethers.Interface(ABI);
  const data = iface.encodeFunctionData('sealScore', [conceptHash, score]);

  return NextResponse.json({
    to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    data,
    conceptHash,
    chainId: 56,
  });
}
