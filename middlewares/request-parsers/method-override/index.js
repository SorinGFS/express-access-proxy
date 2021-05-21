'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const methodOverride = require('method-override');
// method override
router.use(methodOverride('method'));

module.exports = router;