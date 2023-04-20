import {Schema , model}from 'mongoose';



// Document of user
export const documentSchema = new Schema({
  type: {
    type: ["Passport","Drivers license", "ID card"],
    required: true,
    doc: "Type of document"
  },
  ID : {
    type: String,
    required: true,
    doc: "Id number of document"
  },
  DOB: {
      type: Date,
      required: true,
      doc: "DOB of document owner"
  },
  issue: {
    type: Date,
    required: true,
    doc: "Date of issue"
  },
  expiration: {
    type: Date,
    required: false,
    doc: "Date of expiry"
  },
  country: {
    type: String,
    required: true,
    doc: "Country of issue"
  },
});


// Adress of user 
export const AddressSchema = new Schema({
    street: {
      type: String,
      required: true,
      doc: "Street of living"
    },
    city: {
      type: String,
      required: true,
      doc: "City of living"
    },
    state: {
      type: String,
      required: true,
      doc: "State of living"
    },
    country: {
      type: String,
      required: true,
      doc: "Country of living"
    },
    zip: {
      type: String,
      required: true
    },
  });




// KYC model
const KYCschema = new Schema({
  id :{
    type: Number,
    required: true,
    doc: "Id of user"
  },
  document: {
    type:documentSchema,
    required: true
  },
  address: {
    type: AddressSchema,
    required: true
  }
});

export const UserKYC = model('KYC', KYCschema);

