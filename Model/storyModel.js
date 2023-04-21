const mongoose = require("mongoose");

const storyModel = mongoose.Schema({
    addimage: {
        type: String
    },
    addimageID:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "likes"
    }]
}, {timestamps: true});

module.exports = mongoose.model("stories", storyModel);