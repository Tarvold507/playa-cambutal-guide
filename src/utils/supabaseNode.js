
import { createClient } from '@supabase/supabase-js';

// Node.js compatible Supabase client for SSG
export const supabaseNode = createClient(
  "https://yxsnoncplnzekfwaknxb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4c25vbmNwbG56ZWtmd2FrbnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNTc5MjksImV4cCI6MjA2MzYzMzkyOX0.oUUEK4cPPbREJjzYXvsxhXLbpargzgXqqtmQ7xTJ7FI"
);
