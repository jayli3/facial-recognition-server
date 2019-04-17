const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/

app.post('/signin', (req, res) => {
	const {email, password} = req.body;
	db.select('email', 'hash').from('login').where({
		email: email,
	})
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if(isValid){
			db.select('*').from('users').where({
				email: email
			}).limit(1)
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('Error signing in.'))
		}
		else{
			res.status(400).json('Incorrect email and password combination.')
		}
	})
	.catch(err => res.status(400).json('Error signing in.'))
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			email: email,
			hash: hash
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			trx('users')
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			}).returning('*')
			.then(user => {
				res.json(user[0]);
			})
			.then(trx.commit)
			.catch(trx.rollBack)
		}).catch(err => res.status(400).json('Unable to register.'))
	}).catch(err => res.status(400).json('Unable to register.'));
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({
		id: id
	}).limit(1)
		.then(user => {
			if(user.length){
				res.json(user[0])
			}
			else{
				res.status(400).json('User not found.')
			}
		})
		.catch(err => res.status(400).json('Error getting user.'));
})

app.put('/image', (req, res) => {
	const {id, faces} = req.body;
	db('users').where({
		id: id
	}).limit(1).increment({
		faces: faces
	}).returning('faces')
	.then(num => {
		if(num[0]){
			res.json(num[0]);
		}
		else{
			res.status(400).json('User not found.')
		}
	})
	.catch(err => res.status(400).json('Error updating database.'));
})

app.get('/', (req, res) => {
	res.json(database.users);
})
















