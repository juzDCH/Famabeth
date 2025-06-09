// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://jwkvrgonosdelzuhwufm.supabase.co/';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a3ZyZ29ub3NkZWx6dWh3dWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTMzMjIsImV4cCI6MjA2MzI4OTMyMn0.O1SmnuUkYh3qCwPuasspEgT98gPJ6_Shrx8xNDYIfKg';

export const supabase = createClient(supabaseUrl, supabaseKey);