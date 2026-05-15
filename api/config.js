// Returns public Supabase config to the browser (anon key is safe to expose)
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  })
}
