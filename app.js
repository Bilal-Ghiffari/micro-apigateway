require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const myCoursesRouter = require('./routes/myCourses');
const mediaRouter = require('./routes/media');
const refreshTokensRouter = require('./routes/refreshTokens');
const mentorsRouter = require('./routes/mentors');
const chaptersRouter = require('./routes/chapters');
const lessonsRouter = require('./routes/lessons');
const imageCoursesRouter = require('./routes/imageCourses');
const reviewsRouter = require('./routes/reviews');
const webhookRouter = require('./routes/webhook');
const orderPaymentRouter = require('./routes/orderPayments');

// middleware
const verifyToken = require('./middleware/verifyToken');
const role = require('./middleware/permission');

const app = express();

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses',  coursesRouter);
app.use('/my-courses', verifyToken , role('admin', 'student') ,myCoursesRouter);
app.use('/media', verifyToken , role('admin', 'student') ,mediaRouter);
app.use('/refresh-tokens', refreshTokensRouter);
app.use('/mentors', verifyToken , role('admin') ,mentorsRouter);
app.use('/chapters', verifyToken , role('admin') ,chaptersRouter);
app.use('/lessons', verifyToken , role('admin') ,lessonsRouter);
app.use('/image-courses', verifyToken, role('admin') ,imageCoursesRouter);
app.use('/reviews', verifyToken , role('admin', 'student') ,reviewsRouter);
app.use('/webhook', webhookRouter);
app.use('/orders', verifyToken , role('admin', 'student') ,orderPaymentRouter);

module.exports = app;
