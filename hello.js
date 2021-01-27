const express = require('express')
const app = express()
//app.use(express.json())

app.get('/hello', function (req, res) {
  //console.log(res.body);
  res.json({'msg':'hello, world!'});
})  

app.listen(80, () => console.log('Example app listening on port 3000!'))