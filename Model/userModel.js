const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
    },
    avatar:{
        type: String,
    },
    avatarID:{
        type: String,
    },
    verifiedToken: {
        type: String
    },
    isVerify:{
        type: Boolean
    },
    post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }],
    story:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "stories"
    }],
    follower:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]
}, {timestamps: true});

module.exports = mongoose.model("users", userModel);