const Clarifai = require('clarifai');

const CLARIFAI_API_KEY = '7753a1a4e42b42709100728dd5840d4d';
const app = new Clarifai.App({apiKey: CLARIFAI_API_KEY});

const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data);
	}).catch(err => res.status(400).json('Unable to work with API.'));
}

module.exports = {
	handleApiCall: handleApiCall
}