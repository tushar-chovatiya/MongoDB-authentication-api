
// importing database
const mongoose = require('mongoose');
const moment = require('moment')

// creating model for contact us 
const media = mongoose.Schema({
    
        media_for: {
            type: String,
            enum: ["user", "admin"],
        },
        media_for_id: {
            type: Number,
        },
        media_name:{
            type: String,
        },
        media_type:{
            type: String,
            enum: ['image', 'video','gif'],
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

const mediaSchema = mongoose.model('tbl_media', media);

module.exports = mediaSchema;