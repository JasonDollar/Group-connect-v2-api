const jwt = require('jsonwebtoken')

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
})

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  user.password = undefined

  res.cookie('jwt', token, cookieOptions)

  // console.log(res.cookie())
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  })
}

module.exports = { signToken, createAndSendToken }