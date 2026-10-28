import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_STORAGE_BUCKET =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_BUCKET) || 'project-photos';

// Environment variables or localStorage overrides for custom runtime setup
export const getSupabaseConfig = () => {
  const envUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : '';
  const envKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : '';
  
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('mad_supabase_url') : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('mad_supabase_key') : null;

  const url = (customUrl || envUrl || '').trim();
  const key = (customKey || envKey || '').trim();

  return {
    url,
    key,
    bucket: SUPABASE_STORAGE_BUCKET,
    isConfigured: Boolean(url && key && url.startsWith('http') && !url.includes('your-project-id'))
  };
};

let clientInstance: SupabaseClient | null = null;
let lastConfigKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const currentKey = `${url}::${key}`;
  if (!clientInstance || lastConfigKey !== currentKey) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      lastConfigKey = currentKey;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      clientInstance = null;
    }
  }
  return clientInstance;
};

export const updateSupabaseCredentials = (url: string, key: string) => {
  if (typeof window === 'undefined') return;
  if (url && key) {
    localStorage.setItem('mad_supabase_url', url.trim());
    localStorage.setItem('mad_supabase_key', key.trim());
  } else {
    localStorage.removeItem('mad_supabase_url');
    localStorage.removeItem('mad_supabase_key');
  }
  clientInstance = null;
  lastConfigKey = '';
  window.dispatchEvent(new Event('mad_supabase_config_updated'));
};

export const isSupabaseReady = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

export const getStoredConfig = () => {
  return getSupabaseConfig();
};
