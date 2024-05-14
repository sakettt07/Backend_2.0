require('dotenv').config()
const express = require('express')
const app = express()


app.use(express.json());
app.use(express.urlencoded({extended:true}));
// LEarning about Middlewares

app.use(function(req,res,next){
  console.log("i am middleware");
  next();
})

app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/profile', function (req, res,next) {
  return next(new Error("Not implemented"))
})


// Error Handler

app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).send('Something got broke!!')
})
app.listen(process.env.PORT)