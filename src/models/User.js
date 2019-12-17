const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, 'There is already a member with that username'],
    required: [true, 'User must have a name'],
  },
  slug: String,
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'User must have an email'],
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm their password'],
    validate: {
      // works only for save() and create()
      validator(val) {
        return val === this.password
      },
    },
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'createdBy',
})


userSchema.pre('save', function (next) {
  const slug = slugify(this.name)
  this.slug = slug
  next()
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.index({ slug: 1 })

const User = mongoose.model('User', userSchema)

module.exports = User