import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Public values: the publishable key is meant to be shipped in clients.
// What it can do is limited by the row-level-security policies in the database
// (everyone can read, only emails listed in waooo_admins can write).
export const SUPABASE_URL = 'https://dbstgkxqnzbaxxxdgqum.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_8POu32i6i-kz4IZlbjOQHw_Nrofggk0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: Platform.OS === 'web',
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
