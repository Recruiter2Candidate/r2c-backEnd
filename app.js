const express = require('express')
require('dotenv').config()
require("./src/config/connectDB")
const cors = require('cors')
const bodyParser = require('body-parser')



const PORT = process.env.PORT || 3000
const authRoutes = require('./src/routes/auth')
const  chats  = require('./src/data/data')


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:5173', 
}));


app.use('/api/auth', authRoutes);




app.get('/', (req,res)=>{
    res.send('server is up and running')
})

// app.get('/api/chat', (req,res)=>{
//     res.send(chats) 
// })

// app.get('/api/chat/:id', (req,res)=>{
//     // console.log(req.params.id);
//     const singleChat = chats.find((c)=> c._id === req.params.id);
//     res.send(singleChat)
    
// })
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
