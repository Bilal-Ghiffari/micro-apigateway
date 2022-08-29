const express = require('express');
const router = express.Router();
const coursesHandler = require('./handler/courses');
const verifyToken = require('../middleware/verifyToken');
const role = require('../middleware/permission');

router.get('/:id', coursesHandler.get);
router.get('/', coursesHandler.getAll);

router.post('/', verifyToken , role('admin') ,coursesHandler.create);
router.put('/:id', verifyToken , role('admin') ,coursesHandler.update);
router.delete('/:id', verifyToken , role('admin') ,coursesHandler.destroy);

module.exports = router;