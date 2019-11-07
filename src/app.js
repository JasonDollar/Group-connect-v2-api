require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const groupRoutes = require('./routes/groupRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true, 
})
  .then(() => console.log('DB connected'))

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
})

const app = express()
app.use(cors({
  origin: dev ? 'http://localhost:7777' : process.env.PRODUCTION_URL,
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use((err, req, res, next) => {
  const { status = 500, message } = err
  res.status(status).json(message)
})

/* apply routes from the "routes" folder */
app.use('/api/v_1/groups', groupRoutes)
app.use('/api/v_1/users', userRoutes)
app.use('/api/v_1/posts', postRoutes)

app.listen(port, err => {
  if (err) throw err
  console.log(`Server listening on ${ROOT_URL}`)
})

