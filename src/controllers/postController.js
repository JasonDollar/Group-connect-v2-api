const Post = require('../models/Post')
const Group = require('../models/Group')
// const { decodeHashId } = require('../lib/hashid')

exports.fetchSinglePost = async (req, res) => {
  const { groupId, postId } = req.params
  try { 
    // chcek if post is in public group, or private, but with user as a member
    const group = await Group.findOne({ hashid: groupId })

    if (!group.private && req.user.isMember) {
      return res.status(401).json({ status: 'error', message: 'You\'re not authorized' })
    }
    
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'No posts found with that id',
      })
    }
    res.status(200).json({
      status: 'success',
      post,
      createdInGroup: {
        hashid: group.hashid,
        name: group.name,
        _id: group._id,
      }, 
    })
  } catch (e) { 
    res.status(500).json({ status: 'error', message: e.message })
  }
}

exports.createPost = async (req, res) => {
  const { groupId } = req.params
  if (!groupId) {
    return res.status(404).json({
      status: 'error',
      message: 'Provided ID is wrong',
    })
  }

  try {
    const post = await new Post({
      text: req.body.text,
      createdBy: req.user._id,
    }).save()

    await Group.updateOne(
      { hashid: groupId }, 
      { $push: { posts: post._id } },
    )
  
    await post.populate('createdBy', 'name').execPopulate()
  
    res.status(201).json({
      status: 'success',
      post,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

exports.updatePost = async (req, res) => {
  try { 
    const updatedPost = await Post.findOneAndUpdate({ hashid: req.params.postId, createdBy: req.user._id }, req.body, { new: true })

    res.status(200).json({
      status: 'success',
      post: updatedPost,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

exports.deletePost = async (req, res) => {
  try { 
    await Post.findOneAndDelete({ hashid: req.params.postId, createdBy: req.user._id })

    res.status(204).json({
      status: 'success',
      post: null,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

exports.fetchAllPosts = async (req, res) => {
  try { 
    const posts = await Post.find()
    res.status(200).json({
      status: 'success',
      posts,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

exports.fetchAllGroupPosts = async (req, res) => {
  const { groupId } = req.params
  if (!groupId) {
    return res.status(404).json({
      status: 'error',
      message: 'Provided ID is wrong',
    })
  }

  try { 
    const group = await Group.findOne({ hashid: groupId }).populate('posts').select('posts')
    res.status(200).json({
      status: 'success',
      posts: group.posts,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}