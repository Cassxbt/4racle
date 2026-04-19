import { Archetype } from './types';

export interface ArchetypeInfo {
  archetype: Archetype;
  character: string;
  characterFile: string;
  cardCopy: string;
  emoji: string;
}

export function getArchetype(total: number): ArchetypeInfo {
  if (total >= 85) return {
    archetype: 'Actually Alpha',
    character: 'Rare Pepe',
    characterFile: 'rare-pepe.png',
    cardCopy: "Rare. Move fast. This isn't priced in yet.",
    emoji: '🎩',
  };
  if (total >= 70) return {
    archetype: 'Sleeping Giant',
    character: 'Chillguy',
    characterFile: 'chillguy.png',
    cardCopy: "You know something the market doesn't. Yet.",
    emoji: '😌',
  };
  if (total >= 55) return {
    archetype: 'CT Consensus',
    character: 'Doge',
    characterFile: 'doge.png',
    cardCopy: "Everyone's gonna ape in. Timing matters.",
    emoji: '🐕',
  };
  if (total >= 40) return {
    archetype: 'Late to the Party',
    character: 'This Is Fine Dog',
    characterFile: 'this-is-fine.png',
    cardCopy: "The narrative exists. You're in the fire now.",
    emoji: '🔥',
  };
  if (total >= 20) return {
    archetype: 'Exit Liquidity Material',
    character: 'Feels Bad Man Wojak',
    characterFile: 'wojak-feels-bad.png',
    cardCopy: "Crowded. Derivative. You bought the top.",
    emoji: '😢',
  };
  return {
    archetype: 'Dead on Arrival',
    character: 'Coffin Dance',
    characterFile: 'coffin-dance.png',
    cardCopy: "Even the chart would be red. Rethink everything.",
    emoji: '⚰️',
  };
}
