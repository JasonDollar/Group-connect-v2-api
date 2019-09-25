const express = require('express')
const groupController = require('../controllers/groupController')
const authController = require('../controllers/authController')
const postController = require('../controllers/postController')

const router = express.Router()

router.get('/', groupController.fetchGroups)
router.post('/', authController.protect, groupController.createGroup)

router.get('/:groupId', authController.getUserInfoFromCookie, groupController.fetchGroupInfo)
router.get('/:groupId/posts', postController.fetchAllGroupPosts)

// router.get('/:slug', groupController.fetchGroupInfoFromSlug)
// router.patch('/:groupId', groupController.updateGroupInfo)
// router.delete('/:groupId', groupController.deleteGroup)

// router.get('/:groupId/members', groupController.fetchGroupMembers)
// router.post('/:groupId/post-comment', authController.protect, groupController.postCommentInGroup)
// router.patch('/:groupId/join', authController.protect, groupController.joinGroup)
// router.patch('/:groupId/leave', authController.protect, groupController.leaveGroup)

module.exports = router