const express = require('express')

const authController = require('../controllers/authController')
const postController = require('../controllers/postController')

const router = express.Router()

router.get('/:groupId', postController.fetchAllGroupPosts)
router.post('/:groupId/create', authController.protect, authController.checkGroupMembership, postController.createPost)

module.exports = router