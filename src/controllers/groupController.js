const Group = require('../models/Group')
const { decodeHashId } = require('../lib/hashid')
//signToken, createAndSendToken moved to dif. file, 
// fixes in group controllers
exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create({
      name: req.body.name,
      createdBy: req.user._id,
      private: req.body.private ? req.body.private : false,
      members: [{
        user: req.user._id,
        role: 'admin',
      }],
    })
  
    const populatedGroup = await group.populate('members.user', 'name avatar').execPopulate()
  
    res.status(201).json({
      status: 'success',
      group: populatedGroup,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }

}

exports.fetchGroupInfo = async (req, res) => {
  const { groupId } = req.params
  if (!groupId) {
    return res.status(404).json({
      status: 'error',
      message: 'Provided ID is wrong',
    })
  }
  try {
    const group = await Group.findOne({ hashid: groupId })
      .populate('members.user', '_id name avatar')
      .populate('posts').select('-__v')
  
    if (!group) {
      return res.status(404).json({
        status: 'error',
        message: 'No group found',
      })
    }
  
    res.status(200).json({
      status: 'success',
      group,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

exports.fetchGroups = async (req, res) => {
  try {
    const groups = await Group.find({ private: false }).select('_id name slug hashid membersLength')

    res.status(200).json({
      status: 'success',
      groups,
    })
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: e.message,
    })
  }
}

exports.joinGroup = async (req, res) => {
  const { groupId } = req.params
  if (!groupId) {
    return res.status(404).json({
      status: 'error',
      message: 'Provided ID is wrong',
    })
  }
  if (req.user.isMember) {
    return res.status(403).json({
      status: 'error',
      message: 'You are a member already',
    })
  }

  try {
    const group = await Group.findOneAndUpdate({ hashid: groupId }, { 
      $push: {
        members: {
          user: req.user._id,
          role: 'user',
        },
      }, 
      $inc: {
        membersLength: +1,
      },
    }, { new: true })

    res.status(200).json({
      status: 'success',
      group,
    })
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: e.message,
    })
  }
}