const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
   admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin',
    },

   title:String,
   description:String,
    password:String,
    image:String,
  
  });

  module.exports = mongoose.model('Post',postSchema);