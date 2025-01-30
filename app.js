const express = require('express')
require('dotenv').config()
require("./src/config/connectDB")
const cors = require('cors')


const PORT = process.env.PORT || 3000
const authRoutes = require('./src/routes/auth')


const app = express();
app.use(express.json())


app.use('/api/auth', authRoutes);




app.get('/', (req,res)=>{
    res.send('server is up and running')
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
