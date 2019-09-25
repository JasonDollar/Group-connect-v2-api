const Comment = require('../models/Comment')
const { decodeHashId } = require('../lib/hashid')

exports.createComment = async (req, res) => {
  try { 
    // const groupId = decodeHashId(req.params.groupId)
    // if (!groupId) {
    //   return res.status(404).json({
    //     status: 'error',
    //     message: 'Provided ID is wrong',
    //   })
    // }
    const post = await new Comment({
      text: req.body.text,
      createdBy: req.user._id,
      createdInPost: groupId,
    }).save()
  
    await post.populate('createdBy', 'name').execPopulate()
  
    res.status(201).json({
      status: 'success',
      post,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }

}