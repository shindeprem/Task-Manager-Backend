const {mongoose} = require("mongoose")
const { userSchema } = require("./schema.js")

const userModel = new mongoose.model("User",userSchema)

module.exports= {userModel}