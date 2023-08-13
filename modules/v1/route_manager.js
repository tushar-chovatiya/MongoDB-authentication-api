const express = require('express');

const router = express.Router();

const middleware = require('../../middleware/headervalidator');

const auth = require('./auth/routes/auth_routes')

router.use('/', middleware.extractHeaderLanguage);

router.use('/', middleware.validateHeaderApiKey);

router.use('/', middleware.validateHeaderToken);

router.use(auth)

module.exports = router;
