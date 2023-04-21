const likeModel = require('../Model/likeModel');
const postModel = require('../Model/postModel');


const CreateLike = async (req, res) =>{
    try{
        const post = await postModel.findById(req.params.id);
        const likey = new likeModel("liked");

        likey.user = post;
        likey.save();

        post.likes.push(likey);
        post.save();

        res.status(200).json({
            message: "post liked successfully",
            data: likey
        })

    }catch(error){
        res.status(404).json({message: error.message, status: "failed"});
    }
}


module.exports = {
    CreateLike
}