require("./config/db");
const express = require("express");
const cors = require('cors');
const port = 2025;
const app = express();
const router = require("./Router/userRouter")
const postrouter = require("./Router/postRouter");
const likeModel = require("./Model/likeModel");



app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
	res.status(200).json({ message: "Hello and welcome. This is a blog api...!" });
});


app.use("/api/user" , router);
app.use("/api/post", postrouter);
app.use('/api/like', likeModel)
app.listen(port, ()=>{
    console.log(`server is now listening to ${port}`)
})