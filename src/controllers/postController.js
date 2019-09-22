const Post = require('../models/Post')
const { decodeHashId } = require('../lib/hashid')

exports.fetchSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.postId)
  res.status(200).json({
    status: 'success',
    data: post,
  })
}

exports.createPost = async (req, res) => {
  const groupId = decodeHashId(req.params.groupId)
  const post = await new Post({
    text: req.body.text,
    createdBy: req.user._id,
    createdInGroup: groupId,
  }).save()

  await post.populate('createdBy', 'name').execPopulate()

  res.status(201).json({
    status: 'success',
    data: post,
  })
}

exports.updatePost = async (req, res) => {
  const updatedPost = await Post.findOneAndUpdate({ _id: req.params.postId, createdBy: req.user._id }, req.body, { new: true })

  res.status(200).json({
    status: 'success',
    data: updatedPost,
  })
}

exports.deletePost = async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.postId, createdBy: req.user._id })

  res.status(204).json({
    status: 'success',
    data: null,
  })
}

exports.fetchAllPosts = async (req, res) => {
  const posts = await Post.find()
  res.status(200).json({
    status: 'success',
    data: posts,
  })
}

exports.fetchAllGroupPosts = async (req, res) => {
  const groupId = decodeHashId(req.params.groupId)

  const posts = await Post.find({ createdInGroup: groupId })
  res.status(200).json({
    status: 'success',
    data: posts,
  })
}