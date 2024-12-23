const supabase = require('../supabaseClient');

async function checkSupabaseConnection(req, res, next) {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return res.redirect('/login'); // Redirect to login page if not connected
    }
    next();
  } catch (error) {
    res.redirect('/error'); // Redirect to an error page
  }
}

module.exports = checkSupabaseConnection;