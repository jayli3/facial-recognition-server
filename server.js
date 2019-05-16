const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors2 = require('cors');
const knex = require('knex');

const registerC = require('./Controllers/Register');
const signinC = require('./Controllers/SignIn');
const imageC = require('./Controllers/Image');
const imageUrl = require('./Controllers/ImageUrl');
const profileC = require('./Controllers/Profile');


const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server is running on port: ', PORT);
});
app.use(bodyParser.json());
app.use(cors2());

app.post('/signin', (req, res) => {signinC.handleSignIn(req, res, db, bcrypt)});
app.post('/register', (req, res) => {registerC.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profileC.handleProfile(req, res, db)});
app.put('/image', (req, res) => {imageC.handleImage(req, res, db)});
app.post('/imageUrl', (req, res) => {imageUrl.handleApiCall(req, res)});
app.get('/', (req, res) => {res.json('Live: https://github.com/jayli3n/facial-recognition-web-app')});

















