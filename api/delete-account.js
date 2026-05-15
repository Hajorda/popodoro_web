const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body ?? {}
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Send a magic-link to the email. With shouldCreateUser:false, Supabase only
  // sends the email if the account exists — we don't surface this to the caller
  // so we don't leak whether an email is registered.
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${process.env.SITE_URL}/confirm-delete`,
    },
  })

  // Always respond with success — never reveal account existence
  res.json({ success: true })
}
