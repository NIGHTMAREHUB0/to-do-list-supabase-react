import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtmgfzbhrdfzzxkqjrsr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bWdmemJocmRmenp4a3FqcnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTE3NTcsImV4cCI6MjA2ODA4Nzc1N30.snnzvG9ye4R2snerWZ_OL0A62XjXvamBO98A9m-rSh4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
