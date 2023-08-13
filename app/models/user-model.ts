import {Schema , model}from 'mongoose';


// User model
const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    doc: "ID of user(shared between all databases)"
  },
  username :{
    type: String,
    required: true
  },
  level:{
    type: Number,
    required: false,
    doc: "Level of access(KYC): 0(email,password); 1(user model data); 2(KYC model data)"
  },
  balance: {
    type: Number,
    required: false,
    doc: "Fiat balance"
  },
  ETH: {
    type: Number,
    required: false,
    doc: "ETH balance"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  }
});

export const User = model('users', userSchema);
