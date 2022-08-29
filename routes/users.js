const express = require('express');
const router = express.Router();
const handlerUser = require('./handler/users');

// middlewares
const verifyToken = require('../middleware/verifyToken');

router.post('/register', handlerUser.register);
router.post('/login', handlerUser.login);
router.put('/', verifyToken ,handlerUser.updated);
router.get('/', verifyToken ,handlerUser.getUsers);
router.post('/logout', verifyToken ,handlerUser.logout);

module.exports = router;
