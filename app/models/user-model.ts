import mongoose from 'mongoose';



// USER MODEL WILL BE DECLARED BELOW DOCUMENT AND ADRRESS SCHEMA

// Document of user
export const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  DOB: {
      type: Date,
      required: true
  },
  issue: {
    type: Date,
    required: true
  },
  expiration: {
    type: Date,
    required: false
  },
  country: {
    type: String,
    required: true
  },
});


// Adress of user 
export const AddressSchema = new mongoose.Schema({
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
  });




// User model
const userSchema = new mongoose.Schema({
 // we will test this later _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  ETH: {
    type: Number,
    required: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  document: {
    type:documentSchema,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  address: {
    type: AddressSchema,
    required: true
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;