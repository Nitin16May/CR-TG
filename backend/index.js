const express = require('express')
const app = express()
const port = 5000
const mongoDb = require("./db")

mongoDb();

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
})

app.get('/', (req, res) => {
  res.send('API Endpoint for CR-TG')
})


app.use(express.json())
app.use('/', require('./routes/CrtUser'));
app.use('/', require('./routes/CourseBackend'));
app.use('/', require('./routes/StudentBackend'));
app.use('/', require('./routes/AdminBackend'));
app.use('/', require('./routes/FacultyBackend'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
