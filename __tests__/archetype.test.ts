import { describe, it, expect } from 'vitest';
import { getArchetype } from '../lib/archetype';

describe('getArchetype', () => {
  it('returns Actually Alpha for 85-100', () => {
    const r = getArchetype(90);
    expect(r.archetype).toBe('Actually Alpha');
    expect(r.characterFile).toBe('rare-pepe.png');
    expect(r.emoji).toBe('🎩');
  });
  it('returns Sleeping Giant for 70-84', () => {
    const r = getArchetype(75);
    expect(r.archetype).toBe('Sleeping Giant');
    expect(r.characterFile).toBe('chillguy.png');
  });
  it('returns CT Consensus for 55-69', () => {
    const r = getArchetype(60);
    expect(r.archetype).toBe('CT Consensus');
    expect(r.characterFile).toBe('doge.png');
  });
  it('returns Late to the Party for 40-54', () => {
    const r = getArchetype(47);
    expect(r.archetype).toBe('Late to the Party');
    expect(r.characterFile).toBe('this-is-fine.png');
  });
  it('returns Exit Liquidity Material for 20-39', () => {
    const r = getArchetype(30);
    expect(r.archetype).toBe('Exit Liquidity Material');
    expect(r.characterFile).toBe('wojak-feels-bad.png');
  });
  it('returns Dead on Arrival for 0-19', () => {
    const r = getArchetype(10);
    expect(r.archetype).toBe('Dead on Arrival');
    expect(r.characterFile).toBe('coffin-dance.png');
  });
  it('handles boundary at 85/84', () => {
    expect(getArchetype(85).archetype).toBe('Actually Alpha');
    expect(getArchetype(84).archetype).toBe('Sleeping Giant');
  });
  it('handles score 0', () => {
    expect(getArchetype(0).archetype).toBe('Dead on Arrival');
  });
});
