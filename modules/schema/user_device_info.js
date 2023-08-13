const mongoose = require('mongoose');
const moment = require('moment')

// creating model for device information
const UserDeviceinfo = mongoose.Schema({
    // fields
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    device_type: {
        type: String
    },
    device_token: {
        type: String
    },
    uuid: {
        type: String
    },
    os_version: {
        type: String
    },
    device_name: {
        type: String
    },
    model_name: {
        type: String
    },
    ip: {
        type: String
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

const UserdeviceInfo = mongoose.model('tbl_users_device_info', UserDeviceinfo);

module.exports = UserdeviceInfo;



