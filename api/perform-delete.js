const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()

  const authHeader = req.headers.authorization ?? ''
  const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (!accessToken) {
    return res.status(401).json({ error: 'Missing auth token.' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Resolve the user from the access token
  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
  if (userError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }

  // Delete the user permanently
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
  if (deleteError) {
    console.error('perform-delete error:', deleteError)
    return res.status(500).json({ error: 'Deletion failed. Please contact support.' })
  }

  res.json({ success: true })
}
