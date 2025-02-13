const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutrs")
const app = express();
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
app.use(cors())
app.use(express.json());

app.use("/api",productRoutes);
app.use('/', userRouter)
app.use('/uploads', express.static('uploads'))
app.get("/",(req,res)=>{
    res.send("root is working");
});
app.listen(3001,()=>{
    console.log("server is running on port 3001");
});


main().then(()=>{

    console.log("Connected to DB Successfully");
    
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb+srv://hrithikvasanthram:hrithik@cluster0.rrsug.mongodb.net/Ecommerce-Follow-Along")
};

