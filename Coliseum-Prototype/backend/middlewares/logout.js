require('dotenv').config({path: '../../.env'});
const supabase = require('../supabaseClient');

async function logOut(req, res){
    try{
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        res.json({message: 'Signed out successfully', status: 200})
    } catch (error){
        res.status(400).json({message: error.message, status: 400})
    }
}

module.exports  = { logOut }