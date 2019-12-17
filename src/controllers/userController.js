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
      members: { $elemMatch: { user: req.user._id } },
    }).select('-members -__v -private -createdAt -updatedAt -posts -membersLength -createdBy ')

    res.status(200).json({
      status: 'success',
      groups,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message })
  }

}

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.username }).select('-__v -email')

    const groups = await Group.find({
      $and: [
        { members: { $elemMatch: { user: user._id } } },
        { private: false },

      ],
    }).select('-members -__v -private -createdAt -updatedAt -posts -membersLength -createdBy ')

    res.status(200).json({
      status: 'success',
      user: {
        ...user.toObject(),
        groupsMember: groups,
      },
    })

  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message })
  }
}