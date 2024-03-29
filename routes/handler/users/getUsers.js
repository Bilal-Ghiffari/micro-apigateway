const apiAdapter = require('../../apiAdapter');
const {URL_SERVICE_USERS} = process.env;
const api = apiAdapter(URL_SERVICE_USERS);

module.exports = async (req, res) => {
    try {
        const id = req.user.data.id
        const user = await api.get(`/users/${id}`, req.body);
        return res.json(user.data);
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