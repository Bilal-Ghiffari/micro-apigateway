const apiAdapter = require('../../apiAdapter');
const {URL_SERVICE_COURSE, HOSTNAME} = process.env;

const api = apiAdapter(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
    try {
        const courses = await api.get('/api/courses', {
            params: {
                ...req.query,
                // munculkan data hanya status published
                status: 'published'
            }
        });
        const courseData = courses.data;
        const firstPage = courseData.data.first_page_url.split('?').pop();
        const lastPage = courseData.data.last_page_url.split('?').pop();

        // menganti url firstPage dan lastpage menggunakan url apigateway
        // before -> http://127.0.0.1:8000/api/courses?page=1 after -> http://localhost:3000/api/courses?page=1
        courseData.data.first_page_url = `${HOSTNAME}/api/courses?${firstPage}`;
        courseData.data.last_page_url = `${HOSTNAME}/api/courses?${lastPage}`;

        if(courseData.data.next_page_url){
            const nextPage = courseData.data.next_page_url.split('?').pop();
            courseData.data.next_page_url = `${HOSTNAME}/api/courses?/${nextPage}`;
        }

        if(courseData.data.prev_page_url){
            const prevPage = courseData.data.prev_page_url.split('?').pop();
            courseData.data.prev_page_url = `${HOSTNAME}/api/courses?${prevPage}`;
        }

        courseData.data.path = `${HOSTNAME}/api/courses`;

        return res.json(courseData);
    } catch (error) {
        if(error.code === "ECONNREFUSED"){
            return res.status(500).json({
                status: 'error',
                message: 'service unavailable'
            });
        }

        const {status, data} = error.response;
        return res.status(status).json(data);
    }
}