const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/me', authController.protect, userController.getLoggedInUserInfo)
router.get('/groups-member', authController.protect, userController.getGroupsWithUserMembership)

module.exports = router