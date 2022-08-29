const jsonwebtoken = require('jsonwebtoken');
const apiAdapter = require('../../apiAdapter');
const {
    URL_SERVICE_USERS,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,

    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED
} = process.env;

const api = apiAdapter(URL_SERVICE_USERS);

module.exports = async (req, res) => {
    try {
        const user = await api.post('/users/login', req.body);
        const data = user.data.data;

        // access-token
        const accessTkn = jsonwebtoken.sign({data}, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED});
        const refreshTkn = jsonwebtoken.sign({data}, JWT_SECRET_REFRESH_TOKEN, {expiresIn: JWT_REFRESH_TOKEN_EXPIRED});

        // token disimpan didalam DB refresh_token
        await api.post('/refresh_tokens', {
            refresh_token: refreshTkn,
            user_id: data.id
        });

        return res.json({
            status: 'success',
            data: {
                accessTkn,
                refresh_token: refreshTkn
            }
        });

    } catch (error) {
        // jika service media not connect
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable'
            });
        }

        const {status, data} = error.response;
        return res.status(status).json(data)
    }
}