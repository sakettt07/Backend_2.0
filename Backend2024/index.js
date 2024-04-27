require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/yt', function (req, res) {
  res.send('this is my youtube video')
})
app.get('/login',function(req,res){
    res.send('<h1>Please login on the page.</h1>')
})

app.listen(process.env.PORT)