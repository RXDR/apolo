import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://72-61-64-225.sslip.io',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjgyODA0MDAsImV4cCI6MTkyNjA0NjgwMH0.fJECVtt8vSKe5rN3tycLtn87Ql8PY5673sQYsXg4iuA',
  { auth: { persistSession: false } }
)
console.log("Supabase client initialized successfully");
