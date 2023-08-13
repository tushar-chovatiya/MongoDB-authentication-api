// importing database
const mongoose = require('mongoose');
const moment = require('moment')

// creating model for contact us 
const OtpSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    mobile_number: {
        type: String,
    },
    
    email: {
        type: String,
    },

    otp: {
        type: Number,
    },

    social_id: {
        type: String,
    },

    country_code: {
        type: String,
    },

    is_active:{
        type:String,
        description:
            "0 : inactive, 1: Active ",
        enum: ["0", "1"],
        required: true,
        default: 1,
    },

    is_deleted:{
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

const otpverify = mongoose.model('tbl_otps', OtpSchema);

module.exports = otpverify;