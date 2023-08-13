
// importing database
const mongoose = require('mongoose');
const moment = require('moment')

// creating model for contact us 
const notification = mongoose.Schema({
    
        sender_id: {
            type: Number,
        },
        receiver_id: {
            type: Number,
        },
        message:{
            type: String,
        },
        notification_type:{
            type: String,
        },
        status:{
            type: String,
            enum: ['read', 'unread'],
            default: 'unread',
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

const notificationSchema = mongoose.model('tbl_notification', notification);

module.exports = notificationSchema;