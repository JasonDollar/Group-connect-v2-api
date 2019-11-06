const Comment = require('../models/Comment')
const Post = require('../models/Post')
const { decodeHashId } = require('../lib/hashid')

exports.createComment = async (req, res) => {
  try { 
    const groupId = decodeHashId(req.params.groupId)
    if (!groupId) {
      return res.status(404).json({
        status: 'error',
        message: 'Provided ID is wrong',
      })
    }
    const postExists = await Post.exists({ _id: req.params.postId, createdInGroup: groupId })
    if (!postExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Post does not exist',
      })
    }

    const comment = await new Comment({
      text: req.body.text,
      createdBy: req.user._id,
      createdInPost: req.params.postId,
    }).save()

    // update comments array in Post
    await Post.updateOne(
      { _id: req.params.postId, createdInGroup: groupId }, 
      { $push: { comments: comment._id }, $inc: { commentsLength: +1 } },
    )
  
    await comment.populate('createdBy', 'name').execPopulate()
    
    res.status(201).json({
      status: 'success',
      comment,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }

}