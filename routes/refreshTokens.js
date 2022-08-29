const express = require('express');
const router = express.Router();
const handlerRefreshToken = require('./handler/refresh-tokens');

router.post('/', handlerRefreshToken.refreshToken);

module.exports = router;
