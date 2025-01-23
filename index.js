const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userroutes");
const tasksRoutes = require("./routes/tasksroutes");
const dashboardRoutes = require("./routes/dashboard")
const bodyParser = require("body-parser")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const multer = require("multer");
const constants = require("./constants");
const upload = multer();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(cors())
app.options("*", cors());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, 
    methods: "GET,POST,PUT,DELETE", 
    credentials: true
}))
app.use("/user",upload.none(),userRouter)
app.use("/task",upload.none(),tasksRoutes)
app.use("/dashboard",upload.none(),dashboardRoutes)

mongoose.connect(process.env.DEPLOYED_DB_LINK).then(()=>{
    console.log("MongoDB connected successfully");
}).catch((err)=>{
    console.log("There is an error"); 
})

app.listen(constants.PORT,()=>{
    console.log("Server running perfectly");
})

module.exports = {mongoose}