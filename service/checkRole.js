require('dotenv').config()

function checkRole(req,res,next){
    if(res.locals.role == process.env.USER)
    res.status(401).json({ error: { code: 'CUSTOM_ERROR', message: 'Unauthorized' } });
    else
        next()
}
module.exports = { checkRole:checkRole }