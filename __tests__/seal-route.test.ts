import { afterEach, describe, expect, it } from 'vitest';
import { buildConceptHash, getConfiguredSealContractAddress } from '../lib/seal';

const originalContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

afterEach(() => {
  if (originalContractAddress === undefined) {
    delete process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  } else {
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = originalContractAddress;
  }
});

describe('seal-route', () => {
  it('derives a deterministic concept hash from verified public payload fields', () => {
    const hash = buildConceptHash({
      conceptName: 'Chill Guy',
      total: 85,
      issuedAt: 1713744000000,
    });

    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(
      buildConceptHash({
        conceptName: 'Chill Guy',
        total: 85,
        issuedAt: 1713744000000,
      })
    ).toBe(hash);
  });

  it('rejects a missing seal contract address', () => {
    delete process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    expect(() => getConfiguredSealContractAddress()).toThrow('Seal contract is not configured');
  });

  it('rejects the zero seal contract address', () => {
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

    expect(() => getConfiguredSealContractAddress()).toThrow('Seal contract is not configured');
  });

  it('accepts a valid seal contract address', () => {
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = '0x1111111111111111111111111111111111111111';

    expect(getConfiguredSealContractAddress()).toBe('0x1111111111111111111111111111111111111111');
  });
});
