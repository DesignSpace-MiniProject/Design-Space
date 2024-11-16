var express = require('express');

const mongoose = require('mongoose');

const plm = require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/DesignSpace");

const adminSchema = mongoose.Schema({
  
  username:String,
  password:String,
  contact:Number,
  secretkey:{
    type:String,
    default:  function () {
        return "DesignSpace@123"; 
      }
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
  },
  ],

  type: { type: String, default: 'admin' } 
  

});

adminSchema.plugin(plm);
module.exports = mongoose.model("Admin",adminSchema);