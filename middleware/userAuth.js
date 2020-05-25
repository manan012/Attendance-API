const jwt = require('jsonwebtoken');

module.exports= (req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        return res.status(401).json({
            sucess: 'false',
            message: 'Not authenticated'
        })
    }
    const token=req.get('Authorization').split(' ')[1];
    let decodedtoken;
    try{
        decodedtoken=jwt.verify(token,'secretkey');
    }catch(err){
        err.statusCode = 500;
        return res.status(500).json({
            sucess: 'false',
            message: 'Some Error Occurred'
        })
    }
    if(!decodedtoken) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        return res.status(401).json({
            sucess: 'false',
            message: 'Not authenticated'
        })
    }
    //console.log(decodedtoken);
    req.userId = decodedtoken.userId;
    next();
}