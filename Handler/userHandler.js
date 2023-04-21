const userModel = require("../Model/userModel");
const verifyModel = require("../Model/verifyModel");
const jwt = require("jsonwebtoken");
const cloudinary = require('../config/cloudinary');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "cynthiacodes1@gmail.com",
        pass:"kruyndiutpyzimyu"
    }
});

const ErrorHandler = async (error) => {
    let errors = {email: "", password: "", username: "",}

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
};

const createUser = async (req, res) =>{
    try{
        const {username, email, password} = req.body;
        // const avatar = await cloudinary.uploader.upload(req.file.path);
        const avatar = req.file.path;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const tokenVal = crypto.randomBytes(64).toString('hex');
        const myToken = jwt.sign({tokenVal}, "heREIsTheSecRETkEy", {expiresIn: "1d"});

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            avatar,
            avatar: avatar.secure_url,
            avatarID: avatar.public_id,
            verifiedToken: myToken
        });

        await verifyModel.create({
            token: myToken,
            userID: user._id,
            _id: user._id
        });

        const mailOptions = {
            from: "no-reply@gmail.com",
            to:  email,
            subject: "Account verification",
            html: ` <h3>
            Thanks for signing up ${user.username}, please use this 
            <a href='http://localhost:2025/api/user/create/${user._id}/${myToken}'
            >Link to complete your sign up process
            </a>
        </h3> `
        };

        transport.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.log(error)
            }else{
                console.log(`message sent to your mail ${info.response}`);
            }
        });

        res.status(201).json({
            message: "please check your mail to continue"
        });

    }catch(error){
        // const errorMessage = ErrorHandler(error)
        // res.status(400).json({errorMessage});
        console.log(error.message)
        res.status(404).json({
            status:"e no gree run at all oooh!",
            message: error.message
        })
    }
};

const getUsers = async (req, res) =>{
    try{
        const user = await userModel.find();
        res.status(201).json({
            status:"Users found",
            data: user
        })
    }catch(error){
        const errorMessage = ErrorHandler(error)
        res.status(400).json({errorMessage});
        // res.status(404).json({
        //     status:"cannot get all",
        //     message: error.message
        // })
    }
};

const verifyUser = async(req, res) =>{
    try{
        const user = await userModel.findById(req.params.id);

        if(user){
            if(user.verifiedToken !== ""){
                await userModel.findByIdAndUpdate(req.params.id, 
                {
                    isVerify: true,
                    verifiedToken: ""
                }, {new:  true});

                res.status(201).json({message: "User verification successfull. Your account is now active"})
            }else{
                res.status(404).json({message: "unable to verify"})
            }
        }else{
            res.status(404).json({message: "user not found"})
        }
    }catch(error){
        const errorMessage = ErrorHandler(error)
        res.status(400).json({errorMessage});
        // res.status(404).json({
        //     status:"cannot verify user., go look at your code base very well",
        //     message: error.message
        // })
    }
};

const getOneUser = async (req, res) =>{
    try{
        const user = await userModel.findById(req.params.id);
        res.status(201).json({
            status: "user found",
            data: user
        })
    }catch(error){
        const errorMessage = ErrorHandler(error)
        res.status(400).json({errorMessage});
    }
};

const updateUser = async (req, res) =>{
    try{
        const {username} = req.body;
        const user = await userModel.findById(req.params.id)
        if(user.verifiedToken === ""){
            await cloudinary.uploader.destroy(user.avatarID);
            const avatar = await cloudinary.uploader.upload(req.file.path);
            const userData = await userModel.findByIdAndUpdate( req.params.id,
                {
                    username,
                    avatar: avatar.secure_url,
                    avatarID: avatar.public_id
                },
             {new: true}
             );
            res.status(201).json({
                message: "User Updated",
                data: userData
            })
        }
        else{
            res.status(404).json({message:"user not found"})
        }
    }catch(error){
        res.status(404).json({
            message: error.message
        })
        console.log(error)
        // const errorHandle = ErrorHandler(error)
        // res.status(400).json({errorHandle})
    }
};

const updateUserPic = async (req, res) =>{
    try{
        const user = await userModel.findById(req.params.id)
        if(user.verifiedToken === ""){
            await cloudinary.uploader.destroy(user.avatarID);
            const avatar = await cloudinary.uploader.upload(req.file.path);
            // const avatar = req.file.path
            const newAvatar = await userModel.findByIdAndUpdate(req.params.id, 
                {
                    // avatar,
                    avatar: avatar.secure_url,
                    avatarID: avatar.public_id
                }, {new: true});

                res.status(201).json({
                    message: "update successful",
                    data: newAvatar
                });
        }else{
            res.status(404).message({message:"avatar update error"})
        }
    }catch(error){
        res.status(404).json({
            message: error.message
        })
        // const errorHandle = ErrorHandler(error);
        // res.status(400).json({errorHandle})
    }
};

const signIn = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({ email });
        if(user){
            const checkPassword = await bcrypt.compare(password, user.password);
            if(checkPassword){
                if(user.verifiedToken === ""){
                    const token = jwt.sign({
                        _id: user._id,
                        isVerified: user.isVerified
                    }, 
                    "heREIsTheSecRETkEy", 
                    {expiresIn: "1d"}
                    );

                    const {password, ...info} = user._doc;

                    res.status(201).json({
                        message: `welcome back ${user.username}`,
                        data: {token, ...info}
                    })
                }else{

                    const url = "http://localhost:2025";

                    const mailOptions = {
                        from :"cyndyblog@gmail.com",
                        to: email,
                        subject: "SignIn Verification",
                        html: `<h2>
                        Please verify your account with this <a href="${url}/api/user/${user._id}/${token}">Link</a> before signing in
                        </h2>`
                    };

                    transport.sendMail(mailOptions, (error, info) =>{
                        if(error) {
                            console.log(error.message)
                        }else{
                            console.log("mail sent to your email: ", info.response)
                        }
                    });

                    res.status(201).json({message:"Check your email to complete signin process"});
                }
            }else{
                res.status(404).json({message: "Incorrect password"})
            }
        }else{
            res.status(404).json({message: "user not found"})
        }
    }catch(error){
        const errorMessage = ErrorHandler(error)
        res.status(400).json({errorMessage})
    }
}

const forgotPassword = async (req, res) => {
    try{
        const {email} = req.body;
        const user = await userModel.findOne({email});

        if(user){
            if(user.verifiedToken === ""){
                const token = jwt.sign({
                    _id: user._id,
                    isVerified: user.isVerified
                }, 
                "heREIsTheSecRETkEy", 
                {expiresIn: "1d"}
                );

                const url = "http://localhost:2025";

                    const mailOptions = {
                        from :"cyndyblog@gmail.com",
                        to: email,
                        subject: "SignIn Verification",
                        html: `<h2>
                        Please verify your account with this <a href="${url}/api/user/forgotpassword/${user._id}/${token}">Link</a> before signing in
                        </h2>`
                    };

                    transport.sendMail(mailOptions, (error, info) =>{
                        if(error) {
                            console.log(error.message)
                        }else{
                            console.log("mail sent to your email: ", info.response)
                        }
                    });

                    res.status(201).json({message:"Check your email to complete password reset process"});
            }else{
                res.status(404).json({message: "Cannot perform this operation. You have not completed your verification process"});
            }
        }else{
            res.status(404).json({message: "cannot find user with this email"})
        }
    }catch(error){
        const errorMessage = ErrorHandler(error);
        res.status(400).json({errorMessage})
    }
};

const resetPassword = async (req, res) =>{
    try{
        const {password} = req.body;
        const user = await userModel.findById(req.params.id);

        if(user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await userModel.findByIdAndUpdate(user._id, 
            {
                password: hashedPassword
            },
            {new: true}
            );

            res.status(201).json({message: "Password reset successful. You can now sign in"})
        }else{
            res.status(404).json({message: "User not found"});
        }
    }catch(err){
        const errorMessage = ErrorHandler(err)
        res.status(404).json({errorMessage})
    }
}

module.exports = {
    // avatar,
    createUser,
    getUsers,
    verifyUser,
    getOneUser,
    updateUser,
    updateUserPic,
    signIn,
    forgotPassword,
    resetPassword
}