const jwt = require('jsonwebtoken');
const apiAdapter = require('../../apiAdapter');
const {
    URL_SERVICE_USERS,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED
} = process.env;
const api = apiAdapter(URL_SERVICE_USERS);

module.exports = async (req, res) => {
    try {
        const refreshToken = req.body.refresh_token;
        const email = req.body.email;

        // check jika refreshTkn dan email tidak ada data nya
        if(!refreshToken || !email){
            return res.status(400).json({
                status: 'error',
                message: 'invalid token'
            });
        } 

        // check apakah refresh-token ada di DB
        await api.get('/refresh_tokens', {
            params: {
                refresh_token: refreshToken
            }
        });

        jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
            if(err){
                return res.status(403).json({
                    status: 'error',
                    message: err.message
                });
            }

            // const payload = decoded.data;
            // check jika email user tidak sama dengan email yg ada di refresh-token
            if(email !== decoded.data.email){
                return res.status(400).json({
                    status: 'error',
                    message: 'email is not valid'
                });
            }

            // jka email nya sama kita buat new token
            const token = jwt.sign({data: decoded.data}, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED});
            return res.json({
                status: 'success',
                data: {
                    token
                }
            });
        })
    } catch (error) {
        // jika service media not connect
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable'
            });
        }

        const {status, data} = error.response;
        return res.status(status).json(data);
    }
}