const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "cyndytech",
    api_key: "724752416757561",
    api_secret: "7imlGfntrZIJEJIJr3RBTQk0oT0",
    secure: true,
});

module.exports = cloudinary;