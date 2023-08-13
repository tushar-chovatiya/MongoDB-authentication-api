
// importing database
const mongoose = require('mongoose');
const moment = require('moment')

// creating model for contact us 
const faq = mongoose.Schema({
    
        question: {
            type: String,
        },
        answer: {
            type: String,
        },
        status: {
            type: Number,
            description:"0 = Inactive, 1 = Active",
            default:1
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

const faqSchema = mongoose.model('tbl_faqs', faq);

module.exports = faqSchema;