import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or localStorage overrides for custom runtime setup
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('mad_supabase_url') : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('mad_supabase_key') : null;

  const url = customUrl || envUrl || '';
  const key = customKey || envKey || '';

  return { url, key, isConfigured: Boolean(url && key && url.startsWith('http')) };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      clientInstance = null;
    }
  }
  return clientInstance;
};

export const updateSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('mad_supabase_url', url.trim());
    localStorage.setItem('mad_supabase_key', key.trim());
  } else {
    localStorage.removeItem('mad_supabase_url');
    localStorage.removeItem('mad_supabase_key');
  }
  clientInstance = null;
};

export const isSupabaseReady = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

export const getStoredConfig = () => {
  return getSupabaseConfig();
};
