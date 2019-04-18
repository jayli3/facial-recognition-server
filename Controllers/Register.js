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