const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let signup_controller = require('./signup_controller');

app.use('/api',signup_controller,(req,res,next) => {})


module.exports = app;