const User = require('../models/User')
const Group = require('../models/Group')

exports.getLoggedInUserInfo = async (req, res) => {

  // await req.user.populate('posts').execPopulate()

  res.status(200).json({
    status: 'success',
    user: req.user,
  }) 
}

exports.getGroupsWithUserMembership = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id,
    }).select('-members -__v -private -createdAt -createdBy ')

    res.status(200).json({
      status: 'success',
      groups,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message })
  }

}