const User = require('../models/User')
const Group = require('../models/Group')

exports.getLoggedInUserInfo = async (req, res) => {
  // const user = User.findById(req.user._id)
  res.status(200).json({
    status: 'success',
    data: req.user,
  })
}

exports.getGroupsWithUserMembership = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id,
    }).select('-members -__v -private -createdAt -createdBy ')
    // const groups = await Group.find({
    //   members: {
    //     user: {
    //       $in: [req.user._id],
    //     },
    //   },
    // })
    res.status(200).json({
      status: 'success',
      data: groups,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message })
  }

}