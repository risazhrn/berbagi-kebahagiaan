import "server-only";import {createClient} from "@supabase/supabase-js";
/** Server only. Never use this client in browser components. */
export function createAdminClient(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const secret=process.env.SUPABASE_SECRET_KEY;if(!url||!secret)throw new Error('Missing Supabase server environment');return createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}})}
