const express = require('express')
const postController = require('../controllers/postController')
const authController = require('../controllers/authController')


const router = express.Router()

router.get('/api/hello', (req, res) => {
  res.json({
    message: 'hello',
  })
})

// router.get('/api/posts', postController.fetchAllPosts)
// router.post('/api/posts', authController.protect, postController.createPost)

// router.get('/api/posts/:postId', postController.fetchSinglePost)
// router.patch('/api/posts/:postId', authController.protect, postController.updatePost)
// router.delete('/api/posts/:postId', authController.protect, postController.deletePost)

// router.post('/api/users/create', authController.createAccount)
// router.post('/api/users/login', authController.login)


module.exports = router