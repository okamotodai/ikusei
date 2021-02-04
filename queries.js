const express = require('express')
const path = require('path');
const Pool = require('pg').Pool
const methodOverride = require('method-override');
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    //response.status(200).json(results.rows)
    //response.send(results.rows[1].name)
    response.render('index', { users: results.rows });
    //const users = docRef.get()
    //response.sendFile(path.join(__dirname, 'public/test.html'))
  })
}
    //response.status(200).json(results.rows)
    //notjsonバージョン
    //response.send(results)
    //ejsお試し
    //response.render('index', { users: results });
    //html表示
    //response.sendFile(path.join(__dirname, 'public/test.html'))

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//新規ユーザ作成ページ
const getCreateUser = (request, response) => {
  response.sendFile(path.join(__dirname, 'public/test.html'))
}

//postお試し
const postCreateUser = (request, response) => {
  //const  name  = request.body
  //response.send('送信したユーザ名は' + request.body.name)
  response.status(201).send(request.body)
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    //const str = util.inspect(result) 
    //console.log(str) 
    //入力したものを表示
    //response.status(201).send(request.body)
    response.send('登録が完了しました');
    //response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  getCreateUser,
  postCreateUser,
  createUser,
  updateUser,
  deleteUser,
}