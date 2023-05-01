const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
   
    },

    lname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    isDeleted:{
      
      type: Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);
