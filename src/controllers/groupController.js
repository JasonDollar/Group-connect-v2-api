const Group = require('../models/Group')
const { decodeHashId } = require('../lib/hashid')

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
  
    const populatedGroup = await group.populate('members.user', 'name').execPopulate()
  
    res.status(201).json({
      status: 'success',
      group: populatedGroup,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }

}

exports.fetchGroupInfo = async (req, res) => {
  try {
    const groupId = decodeHashId(req.params.groupId)
    if (!groupId) {
      return res.status(404).json({
        status: 'error',
        message: 'Provided ID is wrong',
      })
    }
    const group = await Group.findOne({ _id: groupId }).select('-__v')

  
    if (!group) {
      return res.status(404).json({
        status: 'error',
        message: 'No group found',
      })
    }
    const groupPopulated = await group.populate('createdBy', 'name').execPopulate()
  
    res.status(200).json({
      status: 'success',
      group: groupPopulated,
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }

}

exports.fetchGroups = async (req, res) => {
  try {
    // throw new Error('test error') 
    const groups = await Group.find({ private: false })
    // console.log(groups)
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
