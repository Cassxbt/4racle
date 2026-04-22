import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { decodeScore } from '@/lib/score-codec';
import { buildConceptHash, getConfiguredSealContractAddress } from '@/lib/seal';

const ABI = [
  'function sealScore(bytes32 conceptHash, uint8 score) external returns (uint256 id)',
];

export async function POST(req: NextRequest) {
  let body: { scoreId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.scoreId) {
    return NextResponse.json({ error: 'scoreId required' }, { status: 400 });
  }

  const payload = decodeScore(body.scoreId);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid score token' }, { status: 400 });
  }

  const conceptHash = buildConceptHash({
    conceptName: payload.conceptName,
    total: payload.total,
    issuedAt: payload.issuedAt,
  });
  const iface = new ethers.Interface(ABI);
  const data = iface.encodeFunctionData('sealScore', [conceptHash, payload.total]);
  let contractAddress: string;

  try {
    contractAddress = getConfiguredSealContractAddress();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seal contract is not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    to: contractAddress,
    data,
    conceptHash,
    chainId: 56,
  });
}
