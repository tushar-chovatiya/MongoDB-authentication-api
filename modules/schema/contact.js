// importing database
const moment = require('moment')
const mongoose = require('mongoose');

// creating model for contact us 
const ContactShema = mongoose.Schema({
  user_id : {
    type:String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  descriptions: {
    type: String,
    required: true
  },
  is_active: {
    type: String,
    description:
      "0 : inactive, 1: Active ",
    enum: ["0", "1"],
    required: true,
    default: 1,
  },
  is_deleted: {
    type: Number,
    required: true,
    default: 0,
  },

  created_at: {
    type: Date,
    default: () => moment().utc().format('YYYY-MM-DD HH:mm:ss')
  },
  updated_at: {
    type: Date,
    default: () => moment().utc().format('YYYY-MM-DD HH:mm:ss')
  }
});

const contactModel = mongoose.model('tbl_contact_us', ContactShema);

module.exports = contactModel;