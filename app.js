const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require("morgan")
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
//const {validationResult} = require("express-validator")
const expressValidator = require("express-validator")
// for signin
const cookieParser = require('cookie-parser')
// file system
const fs = require('fs')

// load env variables
const dotenv = require('dotenv')
dotenv.config()

// connect to mongodb
// localhost
// MONGO_URI=mongodb://localhost/nodeapi
// PORT: 8080
// on env
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
  //{useUnifiedTopology: true}
)
  .then(() => console.log('DB Connected'))
// if there's error
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
})

// bring in routes from post.js
// const postRoutes = require('./routes/post')
// destructrured
//const { getPosts } = require('./routes/post')

const postRoutes = require('./routes/post.route')
const authRoutes = require('./routes/auth.route')
const userRoutes = require('./routes/user.route')

// apiDocs
app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }
    // parse data
    const docs = JSON.parse(data)
    res.json(docs)
  })
})

// middleware
// dev is for development mode
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cors())
app.use(cookieParser())
// homepage
// app.get("/", postRoutes.getPosts);
// with destructured 
//app.get("/", getPosts);
// with controller and route thus, postRoutes can act as a middleware
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes)
// from express-jwt package
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`A node js api is listening on port: ${port}`)

});




