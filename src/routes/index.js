const express = require('express');
const router = express.Router();

router.use('/v1/api/food', require('./Food'));
router.use('/v1/api/cart', require('./Cart'));
router.use('/v1/api/access', require('./Access'));

module.exports = router