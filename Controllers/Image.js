const handleImage = (req, res, db) => {
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
}

module.exports = {
	handleImage: handleImage
}