const mongoose = require("mongoose");

const likeModel = mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {timestamps: true});

module.exports = mongoose.model("likes", likeModel);