const jwt = require('jsonwebtoken');

module.exports= (req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token=req.get('Authorization').split(' ')[1];
    let decodedtoken;
    try{
        decodedtoken=jwt.verify(token,'secretkey');
    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedtoken) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    //console.log(decodedtoken);
    req.userId = decodedtoken.userId;
    next();
}