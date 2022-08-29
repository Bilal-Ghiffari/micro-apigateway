const jwt= require('jsonwebtoken');
const {JWT_SECRET} = process.env; 

module.exports = async (req, res, next) => {
    // ambil token di headers
    const token = req.headers.authorization;
    const tkn = token?.split(' ', 2)?.pop();

    jwt.verify(tkn, JWT_SECRET, function(err, decoded) {
        if(err){
            return res.status(403).json({
                message: err.message
            });
        }

        // mengdecode data user
        req.user = decoded;
        return next();
    })
}