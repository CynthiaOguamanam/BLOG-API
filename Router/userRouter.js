const express = require("express");
const router = express.Router();
const { createUser,
        getUsers, 
        verifyUser, 
        getOneUser, 
        updateUser, 
        updateUserPic,
        signIn,
        forgotPassword,
        resetPassword
    } = require("../Handler/userHandler");
const {avatar} = require("../config/multer")

router.route("/").get(getUsers);
router.route("/:id/:token").post(verifyUser);
router.route("/:id").get(getOneUser).patch(updateUser);
router.route("/:id/resetpassword").patch(resetPassword);
// router.route("/:id").patch( updateUser);
router.route("/signin").post(signIn)
router.route("/forgotpassword").post(forgotPassword)
router.route("/create").post(avatar, createUser)

module.exports = router;


