import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for server-side operations (like saving leads)
// to bypass RLS if needed, or use anon key if RLS is configured for public inserts.
// Given this is for lead capture, we likely want to be able to insert from server-side.
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
