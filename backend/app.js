const express = require('express');
const app = express()
const port = 3000;
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser')

const server = require('./server');
const userRouter = require('./modules/user/Routes/auth');

app.use(logger("dev"));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());
app.use(cors({ origin: '*' }))
// authentication middleware
app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (!token) {
    req.user = undefined;
    next();
  }
  else {
    token = token.replace('Bearer ', '');
    jwt.verify(token, 'Nikita_Secret', function (err, decode) {
      if (err) req.user = undefined;
      // if error occurred token will be undefined
      req.user = decode;
      console.log("middleware req.user==>", req.user);
      next();
    });

  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/user', userRouter);