import { createHmac, timingSafeEqual } from 'node:crypto';
import type { PublicSharePayload } from './types';

const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;
const PUBLIC_LAUNCH_DECISIONS = new Set(['Launch', 'Watch', 'Do Not Launch Yet']);
const PUBLIC_SHARE_ARCHETYPES = new Set([
  'Actually Alpha',
  'Sleeping Giant',
  'CT Consensus',
  'Late to the Party',
  'Exit Liquidity Material',
  'Dead on Arrival',
]);

export function encodeBase64UrlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

export function decodeBase64UrlJson<T>(value: string): T | null {
  if (!isValidBase64Url(value)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

export function signPublicSharePayload(payload: PublicSharePayload, secret: string): string {
  const payloadBase64 = encodeBase64UrlJson(payload);
  const signature = createHmac('sha256', secret).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

export function verifyPublicShareToken(token: string, secret: string): PublicSharePayload | null {
  if (typeof token !== 'string' || token.length === 0) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [payloadBase64, signature] = parts;
  if (!isValidBase64Url(payloadBase64) || !isValidBase64Url(signature)) {
    return null;
  }

  const expectedSignature = createHmac('sha256', secret).update(payloadBase64).digest('base64url');
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  const payload = decodeBase64UrlJson<unknown>(payloadBase64);
  if (!isPublicSharePayload(payload)) {
    return null;
  }

  return payload;
}

function isValidBase64Url(value: string): boolean {
  return value.length > 0 && value.length % 4 !== 1 && BASE64URL_PATTERN.test(value);
}

function safeEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left, 'utf8');
  const rightBytes = Buffer.from(right, 'utf8');

  if (leftBytes.length !== rightBytes.length) {
    return false;
  }

  return timingSafeEqual(leftBytes, rightBytes);
}

function isPublicSharePayload(value: unknown): value is PublicSharePayload {
  if (!isRecord(value) || value.v !== 1) {
    return false;
  }

  return (
    typeof value.issuedAt === 'number' &&
    Number.isFinite(value.issuedAt) &&
    typeof value.conceptName === 'string' &&
    typeof value.total === 'number' &&
    Number.isFinite(value.total) &&
    typeof value.decision === 'string' &&
    PUBLIC_LAUNCH_DECISIONS.has(value.decision) &&
    Array.isArray(value.reasons) &&
    value.reasons.every((reason) => typeof reason === 'string') &&
    isDimensionScores(value.dimensions) &&
    typeof value.archetype === 'string' &&
    PUBLIC_SHARE_ARCHETYPES.has(value.archetype) &&
    typeof value.character === 'string' &&
    typeof value.characterFile === 'string' &&
    typeof value.cardCopy === 'string' &&
    typeof value.oracleVerdict === 'string' &&
    isPublicSignalSummary(value.signals) &&
    isSignalCoverage(value.coverage) &&
    Array.isArray(value.evidence) &&
    value.evidence.every(isSignalEvidenceItem)
  );
}

function isDimensionScores(value: unknown): value is PublicSharePayload['dimensions'] {
  return (
    isRecord(value) &&
    typeof value.memeEnergy === 'number' &&
    Number.isFinite(value.memeEnergy) &&
    typeof value.narrativeAlpha === 'number' &&
    Number.isFinite(value.narrativeAlpha) &&
    typeof value.dexgodTiming === 'number' &&
    Number.isFinite(value.dexgodTiming) &&
    typeof value.ctPotential === 'number' &&
    Number.isFinite(value.ctPotential) &&
    typeof value.wagmiFactor === 'number' &&
    Number.isFinite(value.wagmiFactor)
  );
}

function isPublicSignalSummary(value: unknown): value is PublicSharePayload['signals'] {
  return (
    isRecord(value) &&
    typeof value.socialTrending === 'boolean' &&
    (value.saturationLevel === 'LOW' || value.saturationLevel === 'MEDIUM' || value.saturationLevel === 'HIGH') &&
    (value.timingLabel === 'OPTIMAL' || value.timingLabel === 'LATE' || value.timingLabel === 'EARLY' || value.timingLabel === 'MISS') &&
    typeof value.ctBuzz === 'string'
  );
}

function isSignalCoverage(value: unknown): value is PublicSharePayload['coverage'] {
  return (
    isRecord(value) &&
    (value.status === 'full' || value.status === 'partial') &&
    typeof value.healthyCount === 'number' &&
    Number.isFinite(value.healthyCount) &&
    typeof value.degradedCount === 'number' &&
    Number.isFinite(value.degradedCount) &&
    typeof value.unavailableCount === 'number' &&
    Number.isFinite(value.unavailableCount)
  );
}

function isSignalEvidenceItem(value: unknown): value is PublicSharePayload['evidence'][number] {
  return (
    isRecord(value) &&
    (value.key === 'googleTrends' ||
      value.key === 'socialSignal' ||
      value.key === 'twitter' ||
      value.key === 'redditBuzz' ||
      value.key === 'saturation' ||
      value.key === 'dexscreener') &&
    typeof value.label === 'string' &&
    (value.health === 'ok' || value.health === 'degraded' || value.health === 'unavailable') &&
    typeof value.metric === 'string' &&
    typeof value.detail === 'string' &&
    (value.chips === undefined || (Array.isArray(value.chips) && value.chips.every((chip) => typeof chip === 'string'))) &&
    (value.trend === undefined || value.trend === 'rising' || value.trend === 'stable' || value.trend === 'falling') &&
    (value.value === undefined || typeof value.value === 'number' && Number.isFinite(value.value))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
