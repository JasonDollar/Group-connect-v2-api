const express = require('express')

const authController = require('../controllers/authController')
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')

const router = express.Router()


router.post(
  '/:groupId/create', 
  authController.protect, 
  authController.checkGroupMembership, 
  postController.createPost,
)

router.route('/:groupId/:postId')
  .get(authController.checkGroupMembership, postController.fetchSinglePost)
  // .patch()
  // .delete()

router.post(
  '/:groupId/:postId/createComment', 
  authController.protect, 
  authController.checkGroupMembership, 
  commentController.createComment,
)

module.exports = router