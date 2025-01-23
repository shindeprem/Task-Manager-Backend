const express = require("express");
const { userModel } = require("../db/model");
const jwt = require("jsonwebtoken");
const userAuth = require("../middleware/userauth");
const constants = require("../constants");
const router = express.Router()

const JWT_SECRET = constants.JWT_SECRET;

router.get("/userLoginPg",async(req,res)=>{
    try{
        const token = req.cookies.authToken;

        if(!token){
            return res.status(200).json({
                message:"please login"
            })
        }else{
            return res.status(303).json({
                message:"redirect to dashboard"
            })
        }
    }catch(err){
        return res.status(200).json({
            message:"please login"
        })
    }
})

router.post("/userLogin",async(req,res)=>{
    const {email,password} = req.body;

    const userExist = await userModel.findOne({ email: email});

    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userExist.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userExist._id }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("authToken", token, {
      httpOnly: true, 
      secure: true, 
      sameSite: "strict", 
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful", token });
})

router.post("/createUser", async(req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await userModel.findOne({email:email})
        if(!userExist){
            const newUser = await userModel.create({
                email:email,
                password:password
            })
            await newUser.save()
    
            res.status(200).json({
                message:"success"
            })
        }else{
            res.status(401).json({message:"you dont have access to this credentials"})
        }
        
    }catch(err){
        
    }
})


module.exports = router