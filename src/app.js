require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const routes = require('./routes')
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
})
  .then(() => console.log('DB connected'))

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
})

const app = express()
app.use(cors({
  origin: 'http://localhost:7777',
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use((err, req, res, next) => {
  const { status = 500, message } = err
  res.status(status).json(message)
})

/* apply routes from the "routes" folder */
app.use('/', routes)
app.use('/api/groups', groupRoutes)
app.use('/api/user', userRoutes)
app.use('/api/posts', postRoutes)

app.listen(port, err => {
  if (err) throw err
  console.log(`Server listening on ${ROOT_URL}`)
})

