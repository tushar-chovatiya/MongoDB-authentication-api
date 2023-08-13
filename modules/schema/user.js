const mongoose = require('mongoose');
const moment = require('moment')

const userSchema = mongoose.Schema({

    social_id: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: [true, 'Email already exist'],
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    profile_picture: {
        type: String,
        default: "default.png"
    },
    driving_license_image: {
        type: String,
        default: "dl.png"
    },
    id_proof: {
        type: String,
        default: "default.png" 
    },
    utility_bill: {
        type: String,
        default: "default.png"
    },
    rental_aggrement: {
        type: String,
        default: "default.png"
    },
    tax_document: {
        type: String,
        default: "default.png"
    },
    address: {
        type: String
    },
    appartment: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    zip_code: {
        type: String
    },
    latitude:{
        type: String,
        default : "00:0000"
    },
    longitude : {
        type: String,
        default : "00:0000"
    },
   
    refferal_code: {
        type: String
    },
    login_type: {
        type: String,
        enum: ["S", "F", "G", "A"]
    },
    user_type: {
        type: String,
        description:
            " 1: Customer , 2 : Renter",
        enum: ["1", "2"],
        required: true
    },
    is_verify: {
        type: String,
        description:
            "0 : Pending, 1: Accepet , 2 : Reject",
        enum: ["0", "1", "2"],
        default: "0",
        required: ""
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

const userModel = mongoose.model('tbl_users', userSchema);

module.exports = userModel;