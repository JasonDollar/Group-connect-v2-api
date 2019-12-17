const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()


router.post('/create', authController.createAccount)
router.post('/login', authController.login)
router.get('/me', authController.protect, userController.getLoggedInUserInfo)
router.get('/groups-member', authController.protect, userController.getGroupsWithUserMembership)
router.get('/:username', userController.getUserInfo)

module.exports = router