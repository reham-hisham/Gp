const router = require('express').Router()
const post = require('../models/jopPost.model')
const adminController = require('../controllers/admin/admin.controller')

router.post("/login", adminController.login);
 module.exports = router