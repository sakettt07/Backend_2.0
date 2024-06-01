const mongoose =require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/ChaiWala`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to the database successfully");
});
module.exports = db;
