const mongoose = require("mongoose");

const postModel = mongoose.Schema({
    addmessage:{
        type: String
    },
    addimage:{
        type: String
    },
    addimageID:{
        type: String
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    }],
    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "likes"
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {timestamps: true});

module.exports = mongoose.model("posts", postModel);