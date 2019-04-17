const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

knex({
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

const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@email.com',
			password: 'cookies',
			faces: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally@email.com',
			password: 'bananas',
			faces: 0,
			joined: new Date()
		}
	]
}

app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}
	else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
	const new_user = {
		id: '125',
		name: name,
		email: email,
		password: password,
		faces: 0,
		joined: new Date()
	}
	database.users.push(new_user);
	res.json(database.users[database.users.length -1]);
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if(!found){
		res.json('no such');
	}
})

app.put('/image', (req, res) => {
	const {id, faces} = req.body;
	let found = false;
	for(let i = 0; i < database.users.length; i++){
		if(database.users[i].id === id){
			found = true;
			database.users[i].faces = database.users[i].faces + faces;
			return res.json(database.users[i].faces);
		}
	}
	if(!found){
		res.json('no such');
	}
})

app.get('/', (req, res) => {
	res.json(database.users);
})

// bcrypt.hash(password, null, null, (err, hash) => {
//     	console.log(hash);
// 	});
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


















