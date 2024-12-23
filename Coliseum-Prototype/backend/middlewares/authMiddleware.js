// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const supabase = require('../supabaseClient');

async function authMiddleware (req, res, next){

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({error: "No JWT found"});
  }
  
  const token = authHeader.split(" ")[1];

  // get from supabase's access token
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp < Date.now() / 1000 + 300){
      // refresh token if the token is about to expire ~5 minutes

      const {data, error} = await supabase.auth.refreshSession();
      req.user.newToken = data.session.access_token;
    }

    req.user = { id: decoded.sub, email: decoded.email };

    //console.log("user is:", req.user);

    next(); 
  
  } catch(error) {
    if (error.name = "TokenExpiredError"){
      return res.status(401).json({error: "Token expired"});
    }
    else{
      return res.status(400).json({error:error});
    }
  }
}

//there's a try-catch in the middleware anyways
async function checkBannedUser(id, res){
  
  const check = await prisma.user.findFirst({
    where: {userId: id},
    include: {bannedUntil: true}
  })

  let now = new Date()

  if (check.bannedUntil < now || !check.bannedUntil){
    const update = await prisma.user.update({
      where: {userId: id},
      data: {
        bannedUntil: null,
        banRequest: null // clear ban
      }
    })

    return false
  }

  const reason = await prisma.user.findFirst({
    where: {userId: id},
    select:{
      banRequest:{
        select:{
          reason: true,
          proposedTime: true
        }
      }
    }
  })

  return res.status(401).json({message:'banned', reason: reason.banRequest.reason, until: reason.banRequest.proposedTime})
}

module.exports = { authMiddleware };
