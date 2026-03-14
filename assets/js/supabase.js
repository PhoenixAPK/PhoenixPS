// Initialize Supabase
const SUPABASE_URL = 'https://puymabrkwtpvhropcvqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eW1hYnJrd3Rwdmhyb3BjdnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyOTEyOTUsImV4cCI6MjA4ODg2NzI5NX0.kg7WvMRblzVf2iaQbt4Zz7DuNDgHGn9AKFHM_maGiTk';

if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please include the Supabase script tag.');
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for other files
window.supabaseClient = supabaseClient;
