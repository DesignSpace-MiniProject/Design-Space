
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = mongoose.Schema({
  
  name:String,
  email:String,
  subject:String,
  message:String,

});

module.exports = mongoose.model("Contact",contactSchema);