const mongoose = require('mongoose')
const slugify = require('slugify')
const crypto = require('crypto')
const { encodeHashId } = require('../lib/hashid')

// mongoose.plugin(slug)

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 30,
    unique: [true, 'Group name must be unique'],
    required: [true, 'Group name is required'],
  },
  slug: {
    type: String,
    unique: true,
  },
  hashid: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Group has to have a creator'],
  },
  private: {
    type: Boolean,
    default: false,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        default: 'user',
      },
    },
  ],
  membersLength: {
    type: Number,
    default: 1,
  },
}, {
  toJSON: { virtuals: true }, // when data is outputted it should use virtual fields
  toObject: { virtuals: true },
})

// groupSchema.virtual('membersLength').get(function () {
//   return this.members ? this.members.length : undefined
// })

groupSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: '-__v -password -createdAt',
  })
  next()
})

groupSchema.pre('save', function (next) {
  const slug = slugify(this.name, { lower: true })
  const randChars = crypto.randomBytes(2).toString('hex')
  this.slug = slug + '-' + randChars
  next()
})

groupSchema.pre('save', function (next) {
  const hashed = encodeHashId(this._id)
  this.hashid = hashed
  next()
})

groupSchema.pre('save', function (next) {
  const membersLength = this.members.length
  this.membersLength = membersLength
  next()
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group