const express = require("express");
const { userModel } = require("../db/model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const userAuth = require("../middleware/userauth");
const constants = require("../constants");
const router = express.Router();

const JWT_SECRET = constants.JWT_SECRET;

router.get("/userLoginPg", (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(200).json({
            message: "Please login"
        });
    }

    return res.status(303).json({
        message: "Redirect to dashboard"
    });
});

router.post("/userLogin", async (req, res) => {
    const { email, password } = req.body;

    const userExist = await userModel.findOne({ email: email });

    if (!userExist) {
        return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
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
});

router.post("/createUser", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await userModel.findOne({ email: email });

        if (!userExist) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.create({
                email: email,
                password: hashedPassword
            });
            await newUser.save();

            res.status(200).json({
                message: "User created successfully"
            });
        } else {
            res.status(400).json({ message: "User already exists" });
        }
    } catch (err) {
        console.error("Error in user creation:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
