const express = require("express");
const { userModel } = require("../db/model");
const userAuth = require("../middleware/userauth");
const router = express.Router();

router.post("/allTasks",userAuth,async(req,res)=>{
    try{
    const {userId} = req.user;
    const {sort,priority,status,startPoint,endPoint} = req.body;

    const userData = await userModel.findById(userId);
    let tasksData = userData.tasks;

    if(sort!==""){
        if(sort==="Start-Time-ASC"){
            tasksData = tasksData.sort((a,b)=>{
                return new Date(a.startDate) - new Date(b.startDate)
            })
        }else if(sort==="Start-Time-DESC"){
            tasksData = tasksData.sort((a,b)=>{
                return new Date(b.startDate) - new Date(a.startDate)
            })
        }else if(sort==="End-Time-ASC"){
            tasksData = tasksData.sort((a,b)=>{
                return new Date(a.endDate) - new Date(b.endDate)
            })
        }else if(sort==="End-Time-DESC"){
            tasksData = tasksData.sort((a,b)=>{
                return new Date(b.endDate) - new Date(a.endDate)
            })
        }
    }

    if(priority!==""){
        tasksData = tasksData.filter((task)=>{
            return task.priority === Number(priority)
        })
    }

    if(status!==""){
        tasksData = tasksData.filter((task)=>{
            return task.status === status;
        })
    }

    const tasksTotalLength = tasksData.length;
    const slicedTasksArr = tasksData.slice(Number(startPoint),Number(endPoint))

    if(tasksData){
        res.status(200).json({
            message:"success",
            tasksData:slicedTasksArr,
            tasksTotalLength:tasksTotalLength
        })
    }else{
        res.status(401).json({
            message:"request failed"
        })
    }}catch(err){
        res.status(401).json({
            message:"access denied"
        })
    }
})

router.post("/deleteTasks", userAuth, async (req, res) => {
    try {
        const { userId } = req.user; 
        const deleteIds = req.body.deleteIds; 

        if (!deleteIds) {
            return res.status(400).json({ message: "No tasks to delete" });
        }

        // Convert comma-separated string into an array
        const idArr = deleteIds.split(",");

        // Find the user's data
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        await userModel.updateOne(
            { _id: userId },
            {
                $pull: {
                    tasks: { _id: { $in: idArr } },
                },
            }
        );

        const updatedUser = await userModel.findById(userId);

        res.status(200).json({
            message: "Tasks deleted successfully",
            tasksData: updatedUser.tasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/addNewTask",userAuth,async(req,res)=>{
    try{
        const {userId} = req.user;
    const {taskTitle, priority, status,startDate,endDate} = req.body

    const totalTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const convertToHrs = 1000*60*60;
    const totalTimeinHrs = totalTime/convertToHrs;

    const updatedUser = await userModel.findByIdAndUpdate(userId,{$push:{tasks:
        {
            taskTitle:taskTitle,
            priority:priority,
            status:status,
            startDate:startDate,
            endDate:endDate,
            totalTime:totalTimeinHrs
        }
    }},{new:true})

    res.status(200).json({
        message:"success",
        data:updatedUser
    })
    }catch(err){
        
    }
    
})

router.post("/updateUserTask", userAuth, async (req, res) => {
    try {
        const { userId } = req.user;
        const { taskId, taskTitle, priority, status, startDate, endDate } = req.body;

        const totalTime = new Date(endDate).getTime() - new Date(startDate).getTime();
        const convertToHrs = 1000 * 60 * 60;
        const totalTimeInHrs = totalTime / convertToHrs;

        const updatedTasks = await userModel.updateOne(
            { _id: userId, "tasks._id": taskId },
            {
                $set: {
                    "tasks.$": {
                        _id: taskId, 
                        taskTitle: taskTitle,
                        priority: priority,
                        status: status,
                        startDate: startDate,
                        endDate: endDate,
                        totalTime: totalTimeInHrs,
                    },
                },
            }
        );

        if (updatedTasks.modifiedCount === 0) {
            return res.status(400).json({ message: "Task not updated. Check taskId or userId." });
        }

        const user = await userModel.findById(userId);

        res.status(200).json({
            message: "success",
            tasks: user.tasks,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router