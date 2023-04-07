const router = require('express').Router()
const post = require('../models/jopPost.model')
const adminController = require('../controllers/admin/admin.controller')
const adminAuth = require('../middleware/adminAuth')
router.post("/login", adminController.login);
router.post('/add' ,adminAuth , adminController.register )
 module.exports = router