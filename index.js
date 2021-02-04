const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const ejs = require('ejs')
const path = require('path');
const connect = require('connect');
const methodOverride = require('method-override');
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use( methodOverride('_method') );
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/edit/:id', db.getUserById)
app.get('/users/new', db.getCreateUser)
app.post('/users/new', db.createUser)
app.put('/users/edit/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})