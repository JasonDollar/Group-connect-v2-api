const Post = require('../models/Post')
const Group = require('../models/Group')
const { decodeHashId } = require('../lib/hashid')

exports.fetchSinglePost = async (req, res) => {
  try { 
    const post = await Post.findById(req.params.postId)
    res.status(200).json({
      status: 'success',
      post,
    })
  } catch (e) { 
    res.status(500).json({ status: 'error', message: e.message })
  }

}

exports.createPost = async (req, res) => {
  try { 
    const groupId = decodeHashId(req.params.groupId)
    if (!groupId) {
      return res.status(404).json({
        status: 'error',
        message: 'Provided ID is wrong',
      })
    }
    const post = await new Post({
      text: req.body.text,
      createdBy: req.user._id,
      createdInGroup: groupId,
    }).save()

    await Group.updateOne(
      { _id: groupId }, 
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
    const updatedPost = await Post.findOneAndUpdate({ _id: req.params.postId, createdBy: req.user._id }, req.body, { new: true })

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
    await Post.findOneAndDelete({ _id: req.params.postId, createdBy: req.user._id })

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
  try { 
    const groupId = decodeHashId(req.params.groupId)
    // console.log(req.params.groupId, groupId)
    if (!groupId) {
      return res.status(404).json({
        status: 'error',
        message: 'Provided ID is wrong',
      })
    }

    const posts = await Post.find({ createdInGroup: groupId }).populate('createdBy', 'name').select('-comments')
    res.status(200).json({
      status: 'success',
      posts,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }

}