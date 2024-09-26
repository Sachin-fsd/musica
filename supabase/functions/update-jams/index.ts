import { serve } from 'https://deno.land/x/sift/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Get environment variables from Deno.env
const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!;
const supabaseKey = Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')!;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async () => {
  try {
    // Calculate timestamp for one hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Perform the delete operation for inactive jams
    const { error } = await supabase
      .from('jams')
      .delete()
      .lt('lastUpdated', oneHourAgo);

    // Handle errors during deletion
    if (error) {
      console.error('Error deleting old jams:', error);
      return new Response('Error deleting old jams', { status: 500 });
    }

    // Respond if successful
    return new Response('Old jams deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing the request:', error);
    return new Response('Internal server error', { status: 500 });
  }
});
