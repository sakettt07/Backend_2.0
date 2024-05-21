// this is the sheryians file and the same file for the Hitesh sir English.
require('dotenv').config()
const express = require('express')
const app = express()


app.use(express.json());
app.use(express.urlencoded({extended:true}));
// LEarning about Middlewares

app.get('/', function (req, res) {
  res.send('Hello and welcome to my tea store')
})

app.get("/twitter",(req,res)=>{
  res.send("Hi Saket")
})


let teaShop=[];
let nextId=1;

// to add a new tea
app.post("/teas",(req,res)=>{
  const {name,price}=req.body;
  const newTea={id:nextId++,name,price};
  teaShop.push(newTea);
  res.status(201).send(newTea);
})
// to get all the teas
app.get("/teas",(req,res)=>{
  res.send(teaShop);
})
// to get a tea by id
app.get("/teas/:id",(req,res)=>{
  const tea=teaShop.find(t =>t.id ==parseInt(req.params.id));
  if(!tea){
    return res.status(400).send("Tea Not found");
  }
  res.status(200).send(tea);
})
// to update a tea by id
app.put("/teas/:id",(req,res)=>{
  const tea=teaShop.find(t =>t.id ==parseInt(req.params.id));
  if(!tea){
    return res.status(400).send("Tea Not found");
  }
  const{name,price}=req.body;
  tea.name=name
  tea.price=price
  res.status(200).send(tea);
})

// to delete a tea

app.delete("/teas/:id",(req,res)=>{
  const teaIndex=teaShop.findIndex(t => t.id === parseInt(req.params.id));
  if(teaIndex== -1){
    return res.status(404).send("tea not found");
  }
  teaShop.splice(teaIndex,1)
  res.status(200).send("Tea successfully deleted");
})












// Error Handler

app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).send('Something got broke!!')
})
app.listen(process.env.PORT)