const handleSignIn = (req, res, db, bcrypt) => {
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
}

module.exports = {
	handleSignIn: handleSignIn
}