# facial-recognition-server
`Live:` https://jayli3.github.io/facial-recognition-web-app/

Node.js server to handle our facial recognition web app.

**API Used:** Clarifai<br>
Server is deployed on Heroku.

## Goals
- Familiarize myself with server side development with `Node.js` using `Express.js`
- Understand the importance of storing user data securely and privately by hashing their credentials using `bcrypt`
- Know how and when to use middlewares with `Express.js` such as `Knex.js`, `Body-Parser` and `cors`
- Be able to use relational databases to store key information about the user, database used here was `PostgreSQL`

### Sample Code:
----
Below is a code snippet to illustrate the usage of different technologies.

##### Initialise the server with database & middlewares:
```javascript
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
```

##### Request Handlers:
```javascript
app.post('/signin', (req, res) => {signinC.handleSignIn(req, res, db, bcrypt)});
app.post('/register', (req, res) => {registerC.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profileC.handleProfile(req, res, db)});
app.put('/image', (req, res) => {imageC.handleImage(req, res, db)});
app.post('/imageUrl', (req, res) => {imageUrl.handleApiCall(req, res)});
app.get('/', (req, res) => {res.json('Live: https://github.com/jayli3/facial-recognition-web-app')});
```


##### Sample Handler (register):
This is a good one to showcase because it uses `bcrypt` to first hash the password, then writes the new user&apos;s credentials to the database by using a transaction token so that multiple writes to different tables in the db will occur successfully, else the whole operation is cancelled.

```javascript
const handleRegister = (req, res, db, bcrypt) => {
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
}

module.exports = {
	handleRegister: handleRegister
};
```





## Database
Install `PostgreSQL` with brew.
- to create: createdb &lt;database_name&gt;
- to enter: psql &lt;database_name&gt;
- to drop: dropdb &lt;database_name&gt;
- to list: psql -l

## NPM Packages Used:
```json
"dependencies": {
    "bcrypt-nodejs": "0.0.3",
    "body-parser": "^1.18.3",
    "clarifai": "^2.9.0",
    "cors": "^2.8.5",
    "express": "^4.16.4",
    "knex": "^0.16.5",
    "pg": "^7.10.0"
 }
```

## NPM Dev Packages:
```json
"devDependencies": {
    "nodemon": "^1.18.11"
 }
```
