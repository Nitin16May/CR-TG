require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

const mongoDb = require('./db');
mongoDb();

app.use(express.json());
app.use('/', require('./routes/CrtUser'));
app.use('/', require('./routes/CourseBackend'));
app.use('/', require('./routes/StudentBackend'));
app.use('/', require('./routes/AdminBackend'));
app.use('/', require('./routes/FacultyBackend'));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
