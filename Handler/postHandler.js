const postModel = require("../Model/postModel");
const userModel = require("../Model/userModel")
const cloudinary = require('../config/cloudinary');
const mongoose = require("mongoose");

const ErrorHandler = async (error) =>{
    let errors = {addmessage: ""}

    if(error.code === 11000){
        if(error.keyValue.email){
            errors.email = "Email already exists"
            return errors.username
        }
    }

    if(error.message.includes("user validation")){
        Object.values(error.errors).forEach(({properties}) =>{
            error[properties.path] = properties.message
        })
    }
    return errors;
}

const createPost = async (req, res) =>{
    try{
        const {addmessage} = req.body;
        const getuser = await userModel.findById(req.params.userId);
        // const addimage = await cloudinary.uploader.upload(req.file.path);
        const addimage = req.file.path;

        if(getuser.verifiedToken === ""){
            const newPost = new postModel({
                addmessage,
                addimage: addimage.secure_url,
                addimageID: addimage.public_id
            });

            newPost.user = getuser;
            newPost.save();

            getuser.post.push(mongoose.Types.ObjectId(newPost._id));
            getuser.save();

            res.status(201).json({
                status: "Post created successfully",
                data: newPost
            });
        }else{
            res.status(404).json({message: "You cannot make post yet. Go back to mail for verification"})
        }
    }catch(error){
        // const errorMessage = ErrorHandler(error)
        // res.status(400).json({errorMessage})
        res.status(404).json({status: "cannot create post", message: error.message})
    }
};


const getPosts = async (req, res) =>{
    try{
        const posts = await postModel.find();
        res.status(200).json({status: "All post on blog found", data: posts})
    }catch(error){
        const handleErrors = ErrorHandler(error)
        res.status(400).json({handleErrors})
    }
};

const getOneUserAllPosts = async (req, res) =>{
    try{
        const user = await userModel.findById(req.params.userId);
        if(user){
            const posts = await postModel.find()

            res.status(201).json({status:"All posts of this user found", data: posts})
        }else{
            res.status(404).json({message: "user not found"})
        }
    }catch(error){
        const errorHandle = ErrorHandler(error);
        res.status(400).json({errorHandle})
    }
}

const updatePost = async (req, res) =>{
    try{
        const {addmessage} = req.body;
        // const userId = req.params.id;
        const user = await userModel.findById(req.params.id);
        if(user){
            const update = await postModel.findByIdAndUpdate(req.params.id,{
                addmessage,
            }, {new: true});
            res.status(200).json({message: "Update successfull", data: update})
        }else{
            res.status(404).json({message:"Cannot update.,"});
            console.log(error.message)
        }
    }catch(error){
        const errorMessage = ErrorHandler(error)
        res.status(400).json({errorMessage: errorMessage, message: error.message});
    }
}

const updatePostImage = async (req, res) =>{
    try{
        const user = await userModel.findById(req.params.id);

        if(user){
            // await cloudinary.uploader.destroy(req.user.addimageID)
        // const addimage = await cloudinary.uploader.upload(req.file.path);
        const addimage = req.file.path
        const update = await postModel.findByIdAndUpdate(req.params.id, 
        {
            addimage,
            addimage: addimage.secure_url,
            addimageID: addimage.public_id
        }, {new: true});

        res.status(201).json({status: "update successful", data: update})
        }else{
            res.status(404).json({message:"cannot update"});
            console.log(error.message)
        }
    }catch(err){
        res.status(404).json({message: err.message})
    }
}

module.exports = {
    createPost,
    getPosts,
    getOneUserAllPosts,
    getPosts,
    updatePost,
    updatePostImage
}