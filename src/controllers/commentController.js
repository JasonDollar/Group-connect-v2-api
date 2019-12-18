const Comment = require('../models/Comment')
const Post = require('../models/Post')

exports.createComment = async (req, res) => {
  const { postId } = req.params
  try { 
    const postExists = await Post.exists({ _id: postId })
    if (!postExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Post does not exist',
      })
    }

    const comment = await new Comment({
      text: req.body.text,
      createdBy: req.user._id,
      createdInPost: postId,
    }).save()

    // update comments array in Post
    await Post.updateOne(
      { _id: postId }, 
      { $push: { comments: comment._id }, $inc: { commentsLength: +1 } },
    )
  
    await comment.populate('createdBy', 'name avatar slug').execPopulate()
    
    res.status(201).json({
      status: 'success',
      comment,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}