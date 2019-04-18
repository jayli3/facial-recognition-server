const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const registerC = require('./Controllers/Register');
const signinC = require('./Controllers/SignIn');
const imageC = require('./Controllers/Image');
const profileC = require('./Controllers/Profile');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'apple',
    password : '',
    database : 'facial-recognition'
  }
});

const app = express();
const PORT = 3001;
app.listen(PORT, () => {
	console.log('Server is running on port: ', PORT);
});
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, res) => {signinC.handleSignIn(req, res, db, bcrypt)});
app.post('/register', (req, res) => {registerC.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profileC.handleProfile(req, res, db)});
app.put('/image', (req, res) => {imageC.handleImage(req, res, db)});

app.get('/', (req, res) => {
	res.json(database.users);
})
















