require('dotenv').config()
const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next){
    const rawHeaders = req.rawHeaders;
    for (let i = 0; i < rawHeaders.length; i += 2) {
        if (rawHeaders[i].toLowerCase() === 'authorization') {
         token = rawHeaders[i + 1];
          break;
        }
      }
    token = token && token.split(' ')[1]
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

