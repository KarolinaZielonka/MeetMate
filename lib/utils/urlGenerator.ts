import { supabase } from '@/lib/supabase/client';

/**
 * Adjectives for readable URL generation
 */
const ADJECTIVES = [
  'sunny', 'happy', 'bright', 'calm', 'cool', 'warm', 'swift', 'clever',
  'brave', 'gentle', 'quick', 'bold', 'kind', 'wise', 'proud', 'fair',
  'wild', 'free', 'pure', 'true', 'grand', 'noble', 'royal', 'vital',
  'cosmic', 'mystic', 'golden', 'silver', 'crystal', 'electric', 'dynamic',
  'vibrant', 'serene', 'peaceful', 'joyful', 'merry', 'cheerful', 'lively'
];

/**
 * Nouns (animals) for readable URL generation
 */
const NOUNS = [
  'dolphin', 'eagle', 'tiger', 'panda', 'fox', 'wolf', 'bear', 'lion',
  'hawk', 'owl', 'deer', 'rabbit', 'otter', 'falcon', 'raven', 'swan',
  'phoenix', 'dragon', 'unicorn', 'pegasus', 'griffin', 'sphinx', 'kraken',
  'lynx', 'cobra', 'jaguar', 'leopard', 'cheetah', 'panther', 'cougar',
  'bison', 'moose', 'elk', 'gazelle', 'antelope', 'buffalo', 'mustang'
];

/**
 * Generate a random number between min and max (inclusive)
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a readable share URL in format: adjective-noun-number
 * Example: "sunny-dolphin-42"
 */
export function generateShareUrl(): string {
  const adjective = ADJECTIVES[getRandomInt(0, ADJECTIVES.length - 1)];
  const noun = NOUNS[getRandomInt(0, NOUNS.length - 1)];
  const number = getRandomInt(10, 99);

  return `${adjective}-${noun}-${number}`;
}

/**
 * Validate that a share URL is unique in the database
 * Returns true if URL is unique (can be used), false if already exists
 */
export async function validateShareUrl(shareUrl: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('events')
    .select('share_url')
    .eq('share_url', shareUrl)
    .single();

  // If no data found, URL is unique
  if (error && error.code === 'PGRST116') {
    return true;
  }

  // If data exists, URL is taken
  if (data) {
    return false;
  }

  // Handle other errors conservatively
  return false;
}

/**
 * Generate a unique share URL by checking against the database
 * Retries up to maxRetries times if collisions occur
 */
export async function generateUniqueShareUrl(maxRetries: number = 10): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const shareUrl = generateShareUrl();
    const isUnique = await validateShareUrl(shareUrl);

    if (isUnique) {
      return shareUrl;
    }
  }

  // Fallback: append timestamp if we couldn't find a unique URL
  const fallbackUrl = generateShareUrl();
  const timestamp = Date.now().toString(36);
  return `${fallbackUrl}-${timestamp}`;
}
