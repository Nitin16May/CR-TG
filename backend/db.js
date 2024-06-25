require('dotenv').config();
const mongoose = require('mongoose');

const mongoDb = async () => {
	await mongoose.connect(process.env.MongoDB_URI, async () => {
		console.log('connected');
	});
};

module.exports = mongoDb;
