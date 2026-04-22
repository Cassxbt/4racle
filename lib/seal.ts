import { ethers } from 'ethers';

export function getConfiguredSealContractAddress(): string {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();

  if (!address || !ethers.isAddress(address) || address === ethers.ZeroAddress) {
    throw new Error('Seal contract is not configured');
  }

  return address;
}

export function buildConceptHash(input: {
  conceptName: string;
  total: number;
  issuedAt: number;
}): string {
  return ethers.keccak256(
    ethers.toUtf8Bytes(`${input.conceptName}|${input.total}|${input.issuedAt}`)
  );
}
