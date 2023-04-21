const express = require("express");
const postRouter = express.Router();

const { createPost, getOneUserAllPosts, getPosts, updatePost, updatePostImage } = require("../Handler/postHandler");
const {addimage} = require("../config/multer")
postRouter.route("/:userId/create").post(addimage, createPost);
postRouter.route("/:userId/getoneuserallpost").get(getOneUserAllPosts);
postRouter.route("/getposts").get(getPosts);
postRouter.route("/:userId/:id/updatepost").patch(updatePostImage,updatePost)


module.exports = postRouter;