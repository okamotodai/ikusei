const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const path = require('path')
const port = 3000

app.use(bodyParser.json())
//着信リクエストオブジェクトを文字列または配列として認識するため
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.static(path.join(__dirname, 'public')))//静的配信のフォルダを指定

//viewsディレクトリ以下のejsファイル認識させる
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})