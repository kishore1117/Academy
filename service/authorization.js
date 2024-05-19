require('dotenv').config()
const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next){
    const authHeader = req.rawHeaders[1]
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)
    return   res.status(401).json({ error: { code: 'CUSTOM_ERROR', message: 'Unauthorized' } });

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response)=>{
        if(err)
        return   res.status(403).json({ error: { code: 'CUSTOM_ERROR', message: 'Forbidden' } });
        res.locals = response
        next()
    })
}

module.exports = {authenticateToken: authenticateToken}

