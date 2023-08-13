
// importing database
const mongoose = require('mongoose');
const moment = require('moment')

// creating model for contact us 
const app_pages = mongoose.Schema({
    
        title : {
            type:String,
        },
        alias : {
            type:String,
        },
        content : {
            type:String,
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

const AppContentSchema = mongoose.model('tbl_app_pages', app_pages);

module.exports = AppContentSchema;