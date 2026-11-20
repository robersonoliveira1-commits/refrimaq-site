import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url =
  (typeof import.meta.env !== 'undefined'
    ? (import.meta.env.VITE_SUPABASE_URL as string | undefined)
    : undefined
  )?.trim() ?? '';
const anonKey =
  (typeof import.meta.env !== 'undefined'
    ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
    : undefined
  )?.trim() ?? '';

export const isSupabaseConfigured =
  Boolean(url) &&
  Boolean(anonKey) &&
  !url.includes('placeholder.supabase.co');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
