const supabase = require('../supabaseClient');
require('dotenv').config({path: '../../.env'});

async function signIn(req, res){

    const {email, password} = req.body;

    console.log(email, password);

    try{
        const {user, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error){
            throw error
        }

        const currentUser = await supabase.auth.getUser()
        const currentSession = await supabase.auth.getSession()
        //supabase makes its own access token in getSession()
        
        res.json({ 
            message:'Signed in successfully', 
            status: 200, 
            token: currentSession.data.session.access_token,
            user: currentUser,
        })    
    } catch(error){
        res.status(400).json({message: 'Invalid email or password', status: 400})
    }
}

module.exports = {signIn}