var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const plm = require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/DesignSpace");

const userSchema = mongoose.Schema({
  
  username:String,
  email:String,
  contact :Number,
  password:String,
 
  
  

});

userSchema.plugin(plm);
module.exports = mongoose.model("User",userSchema);