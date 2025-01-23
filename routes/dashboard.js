const express = require("express");
const userAuth = require("../middleware/userauth");
const { userModel } = require("../db/model");
const router = express.Router()

router.get("/dashboardStats",userAuth,async(req,res)=>{
    try{
        const {userId} = req.user;

        const user = await userModel.findById(userId);
        const userTasks = user.tasks;

        const totalTasksCount = userTasks.length
        const pendingTasks = userTasks.filter((task)=>{
            return task.status==="pending"
        })
        const finishedTasks = userTasks.filter((task)=>{
            return task.status==="finished"
        })
        const pendingTasksCount = pendingTasks.length;
        const finishedTasksCount = finishedTasks.length;
        const pendingTasksInPercentage = ((pendingTasksCount*100)/totalTasksCount).toFixed(2)
        const finishedTaskInPercentage = (100-pendingTasksInPercentage)

        let totalCompletionTime = 0;
        finishedTasks.forEach(task => {
            console.log(task);
            
            totalCompletionTime+=task.totalTime.toFixed(2)
        });
        const avgTimeForCompletedTask = totalCompletionTime>0?(totalCompletionTime/finishedTasksCount):0


        let totalTimeLapsed = 0
        const currentTime = new Date();
        pendingTasks.forEach((task)=>{
            let startTime = new Date(task.startDate)

            if(currentTime<startTime){
                totalTimeLapsed+=0
            }else if(currentTime>startTime){
                let timeDifference = currentTime-startTime;
                let timeDifferenceInHrs = timeDifference/(1000*60*60)
                totalTimeLapsed+=timeDifferenceInHrs
            }
        })

        let totalTimeToFinishPendingTasks = 0;
        pendingTasks.forEach((task)=>{
            let endTime = new Date(task.endDate)
            if(currentTime>endTime){
                totalTimeToFinishPendingTasks+=0
            }else if(currentTime<endTime){
                let timeToFinishTask = endTime-currentTime;
                let timeToFinishTaskInHrs = timeToFinishTask/(1000*60*60)
                totalTimeToFinishPendingTasks+=timeToFinishTaskInHrs
            }
        })


        // filtering with priority
        const firstPriorityLst = pendingTasks.filter((task)=>{
            return task.priority===1
        })
        const secondPriorityLst = pendingTasks.filter((task)=>{
            return task.priority===2
        })
        const thirdPriorityLst = pendingTasks.filter((task)=>{
            return task.priority===3
        })
        const fourthPriorityLst = pendingTasks.filter((task)=>{
            return task.priority===4
        })
        const fifthPriorityLst = pendingTasks.filter((task)=>{
            return task.priority===5
        })

        let timeLapsedPriorityOne = 0;
        firstPriorityLst.forEach((task)=>{
            let startTime = new Date(task.startDate)

            if(currentTime<startTime){
                timeLapsedPriorityOne+=0
            }else if(currentTime>startTime){
                let timeDifference = currentTime-startTime;
                let timeDifferenceInHrs = timeDifference/(1000*60*60)
                timeLapsedPriorityOne+=timeDifferenceInHrs
            }
        })

        let timeLapsedPriorityTwo = 0;
        secondPriorityLst.forEach((task)=>{
            let startTime = new Date(task.startDate)

            if(currentTime<startTime){
                timeLapsedPriorityTwo+=0
            }else if(currentTime>startTime){
                let timeDifference = currentTime-startTime;
                let timeDifferenceInHrs = timeDifference/(1000*60*60)
                timeLapsedPriorityTwo+=timeDifferenceInHrs
            }
        })

        let timeLapsedPriorityThree = 0;
        thirdPriorityLst.forEach((task)=>{
            let startTime = new Date(task.startDate)

            if(currentTime<startTime){
                timeLapsedPriorityThree+=0
            }else if(currentTime>startTime){
                let timeDifference = currentTime-startTime;
                let timeDifferenceInHrs = timeDifference/(1000*60*60)
                timeLapsedPriorityThree+=timeDifferenceInHrs
            }
        })

        let timeLapsedPriorityFour = 0;
        fourthPriorityLst.forEach((task)=>{
            let startTime = new Date(task.startDate)

            if(currentTime<startTime){
                timeLapsedPriorityFour+=0
            }else if(currentTime>startTime){
                let timeDifference = currentTime-startTime;
                let timeDifferenceInHrs = timeDifference/(1000*60*60)
                timeLapsedPriorityFour+=timeDifferenceInHrs
            }
        })

        let timeLapsedPriorityFive = 0;
        fifthPriorityLst.forEach((task)=>{
            let startTime = new Date(task.startDate)

            if(currentTime<startTime){
                timeLapsedPriorityFive+=0
            }else if(currentTime>startTime){
                let timeDifference = currentTime-startTime;
                let timeDifferenceInHrs = timeDifference/(1000*60*60)
                timeLapsedPriorityFive+=timeDifferenceInHrs
            }
        })

        let timeToFinishPriorityOne = 0;
        firstPriorityLst.forEach((task)=>{
            let endTime = new Date(task.endDate)
            if(currentTime>endTime){
                timeToFinishPriorityOne+=0
            }else if(currentTime<endTime){
                let timeToFinishTask = endTime-currentTime;
                let timeToFinishTaskInHrs = timeToFinishTask/(1000*60*60)
                timeToFinishPriorityOne+=timeToFinishTaskInHrs
            }
        })
        let timeToFinishPriorityTwo = 0;
        secondPriorityLst.forEach((task)=>{
            let endTime = new Date(task.endDate)
            if(currentTime>endTime){
                timeToFinishPriorityTwo+=0
            }else if(currentTime<endTime){
                let timeToFinishTask = endTime-currentTime;
                let timeToFinishTaskInHrs = timeToFinishTask/(1000*60*60)
                timeToFinishPriorityTwo+=timeToFinishTaskInHrs
            }
        })
        let timeToFinishPriorityThree = 0;
        thirdPriorityLst.forEach((task)=>{
            let endTime = new Date(task.endDate)
            if(currentTime>endTime){
                timeToFinishPriorityThree+=0
            }else if(currentTime<endTime){
                let timeToFinishTask = endTime-currentTime;
                let timeToFinishTaskInHrs = timeToFinishTask/(1000*60*60)
                timeToFinishPriorityThree+=timeToFinishTaskInHrs
            }
        })
        let timeToFinishPriorityFour = 0;
        fourthPriorityLst.forEach((task)=>{
            let endTime = new Date(task.endDate)
            if(currentTime>endTime){
                timeToFinishPriorityFour+=0
            }else if(currentTime<endTime){
                let timeToFinishTask = endTime-currentTime;
                let timeToFinishTaskInHrs = timeToFinishTask/(1000*60*60)
                timeToFinishPriorityFour+=timeToFinishTaskInHrs
            }
        })
        let timeToFinishPriorityFive = 0;
        fifthPriorityLst.forEach((task)=>{
            let endTime = new Date(task.endDate)
            if(currentTime>endTime){
                timeToFinishPriorityFive+=0
            }else if(currentTime<endTime){
                let timeToFinishTask = endTime-currentTime;
                let timeToFinishTaskInHrs = timeToFinishTask/(1000*60*60)
                timeToFinishPriorityFive+=timeToFinishTaskInHrs
            }
        })

        res.status(200).json({
            totalTasks:totalTasksCount,
            taskCompleted:finishedTaskInPercentage,
            taskPending:pendingTasksInPercentage,
            avgTimeForCompletedTask:avgTimeForCompletedTask,
            totalPendingTasks:pendingTasksCount,
            totalTimeLapsed:totalTimeLapsed,
            totalTimeToFinish:totalTimeToFinishPendingTasks,
            pendingTasksStatsWithPriority:[
                {
                    taskPriority:1,
                    pendingTasks:firstPriorityLst?.length,
                    timeLapsed:timeLapsedPriorityOne,
                    timeToFinish:timeToFinishPriorityOne
                },
                {
                    taskPriority:2,
                    pendingTasks:secondPriorityLst?.length,
                    timeLapsed:timeLapsedPriorityTwo,
                    timeToFinish:timeToFinishPriorityTwo
                },
                {
                    taskPriority:3,
                    pendingTasks:thirdPriorityLst?.length,
                    timeLapsed:timeLapsedPriorityThree,
                    timeToFinish:timeToFinishPriorityThree
                },
                {
                    taskPriority:4,
                    pendingTasks:fourthPriorityLst?.length,
                    timeLapsed:timeLapsedPriorityFour,
                    timeToFinish:timeToFinishPriorityFour
                },
                {
                    taskPriority:5,
                    pendingTasks:fifthPriorityLst?.length,
                    timeLapsed:timeLapsedPriorityFive,
                    timeToFinish:timeToFinishPriorityFive
                }
            ]
        })
    }catch(err){
        res.status(401).json({message:"failed request"})
    }
    
})

module.exports = router