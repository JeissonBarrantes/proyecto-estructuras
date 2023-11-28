const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    user_id: {
        type: String,
    },

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    business_id:{
        type: Array,
    }

});

module.exports = mongoose.model('User', userSchema);