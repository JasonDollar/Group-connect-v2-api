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
  const groups = await Group.find({
    'members.user': req.user._id,
  })
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
}