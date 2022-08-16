let express = require('express')

const router = express.Router()

const Task = require('../models/task')

//requiring passport for auth
const passport = require('passport')

//function to check if the user is authenticated or not.This function is called in create, edit and delete methods
function authCheck(req,res,next){
    //using express to chgeck user identity
    if(req.isAuthenticated()){
        return next()
    }
    //if the user is not found, go to login
    res.redirect('/login')
}



//GET: /tasks
router.get('/',(req, res)=>{
    Task.find((err, studentName,Registration,studentNumber)=>{
        if(err){
            console.log(err)
            res.end(err)
        }
        else{
            res.render('tasks/index',{
                studentName:studentName,
                Registration:Registration,
                studentNumber:studentNumber,
                title:'tasks',
                user: req.user

            })
        }
    })
    //   res.render('tasks/index')

})


//GET: /tasks/create => add a new task - function authCheck is called
router.get('/create', authCheck,(req,res)=>{
    res.render('tasks/create', {
        title:'Add new Student',
        user: req.user
    })
})

//POST: /tasks/create => process form submission and saving new task - function authCheck is called
router.post('/create',authCheck,(req, res)=>{
    //using mongoose model to create a new task
    Task.create({
        studentName: req.body.studentName,
        Registration: req.body.Registration,
        studentNumber: req.body.studentNumber,
    },(err)=>{
        if(err){
            console.log(err)
            res.end(err)
        }
        else{ //in case the task is saved successfully, update the list view
            res.redirect('/tasks')
        }
    })
})

//GET: /tasks/delete/task_id => will delete task based on _id parameter - function authCheck is called
router.get('/delete/:_id',authCheck,(req,res)=>{
    //get document id from url parameter
    let _id = req.params._id

    //using mongoose to delete the task and redirecgt
    Task.remove({_id: _id}, (err)=>{
        if(err){
            console.log(err)
            res.end(err)
        }
        else{
            res.redirect('/tasks')
        }
    })

})


//GET: /tasks/edit/task_id => prepopulate field with task - function authCheck is called
router.get('/edit/:_id', authCheck,(req,res)=>{
    let _id = req.params._id

    Task.findById(_id,(err, studentName,Registration,studentNumber)=>{
        if(err){
            console.log(err)
            res.end(err)
        }
        else{
            res.render('tasks/edit',{
                title:'Edit task',
                studentName:studentName,
                Registration:Registration,
                studentNumber:studentNumber,
                user: req.user
            })
        }
    })
})

//POST: /tasks/edit/task_id => updating the task with the new values from the field - function authCheck is called
router.post('/edit/:_id',authCheck,(req,res)=>{
    let _id = req.params._id

    Task.findByIdAndUpdate({_id: _id},{'studentName':req.body.studentName,'Registration':req.body.Registration,'studentNumber':req.body.studentNumber}, null,(err, task)=>{
        if(err){
            console.log(err)
            res.end(err)
        }
        else{
            res.redirect('/tasks')
        }
    })
})

module.exports = router