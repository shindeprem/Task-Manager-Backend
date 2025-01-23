const {mongoose} = require("mongoose")

const taskSchema = {
    taskTitle:{
        type:String,
        required:true
    },
    priority:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"pending"
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    totalTime:{
        type:Number,
        required:true
    }
}

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tasks:{
        type:[taskSchema]
    }
})

module.exports = {userSchema}