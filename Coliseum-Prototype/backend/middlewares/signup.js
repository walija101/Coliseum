const { PrismaClient } = require('@prisma/client')
const supabase = require('../supabaseClient');
const prisma = new PrismaClient()
require('dotenv').config();

// function to create user
async function createUser(req, res){

    const {email, password, firstName, lastName, maidenName, image, bday } = req.body
    try{
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { 
                //metadata   
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    maidenName: maidenName,
                    role: 'USER',
                    profileImageURL: image
                }
            }
        })

        if (error){
            throw error;
        }

        // get user data after signing up
        const user = data.user;

        // extract metadata
        let metadata = user.user_metadata;  
        
        console.log(user);
        console.log(metadata);

        //put metadata into database through prisma
        const newUser = await prisma.user.create({
            data:{
                id: user.id,
                email: user.email,
                firstName: metadata.firstName,
                lastName: metadata.lastName,
                maidenName: metadata.maidenName,
                role: 'USER',
                profileImageURL: metadata.profileImageURL,
                bday: new Date(bday),                
            },
        })

        console.log('new user is:', newUser);

        res.status(201).json({ message: 'Signup successful', newUser, status: 201})

    } catch(error){
        res.status(400).json({ message: 'Error: ' + error.message})
        console.log(error.message);
        return;
    }
}

module.exports = {createUser}
  