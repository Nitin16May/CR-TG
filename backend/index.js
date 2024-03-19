const express = require('express')
const app = express()
const port = 5000
const mongoDb = require("./db")

app.use((req, res, next)=>{
  if (req.method === 'OPTIONS') {
    // preflight request. reply successfully:
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND_URL);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
})

mongoDb();

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
