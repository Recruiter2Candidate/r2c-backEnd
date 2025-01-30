const mongoose = require('mongoose');

const MONGO_URI = process.env.LOCAL_MONGO_URI;

mongoose.connect(MONGO_URI);

mongoose.connection
    .on("open", ()=>{
        console.log("Database connected")
        
    })

    .once("error", ()=>{
        console.log("failed to connect to database")
        
    })

    module.exports = mongoose;
