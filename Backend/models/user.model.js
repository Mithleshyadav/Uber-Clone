const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname: {
  firstname: {
    type: String,
    required: true,
    minlength:[3, 'First name must be at least 3 characters long'],
  },
  lastname: {
    type: String
   
  }
  },
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
},
password: {
  type: String,
  required: true,
  select: false,
  minlength:[6, 'Password must be at least 6 characters long'],
},
socketId: {
  type: String,
}


});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
  
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;



