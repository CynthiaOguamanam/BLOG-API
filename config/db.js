const mongoose = require('mongoose')

const url = 'mongodb://localhost/blogModel';
mongoose.connect(url).then(()=>{
    console.log('database connection successfully')
}).catch((error)=>{
    console.log(error.message)
});

module.exports = mongoose; 