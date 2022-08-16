var express = require('express');
var router = express.Router();
//reference to passport
const passport = require('passport')
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'Student Management',
      user:req.user
  });
});

//GET: /about


//GET: /register
router.get('/register',(req,res)=>{
    res.render('register',{
        title:'Register'
    })
})

//POST: /register
router.post('/register',(req,res)=>{
    //using User Model and passport to create a new user in MongoDB. Send passport separately so it can be hashed by passport
    User.register(new User({username:req.body.username}), req.body.password,(err,newUser)=>{
        if(err){
            console.log(err)
            res.render('register',{
                message: err
            })
        }
        //in case registration is successful:
        else{
            req.login(newUser,(err)=>{
                res.redirect('/tasks')
            })
        }
    })

})



//GET: /login
router.get('/login',(req,res)=>{
    //checking for error messages
    let messages = req.session.messages || []
    req.session.messages = []

    res.render('login',{
        title:'Login',
        messages: messages
    })
})

//POST: /login
router.post('/login',passport.authenticate('local',{
    successRedirect: '/tasks',
    failureRedirect:'/login',
    failureMessage:'Invalid Login'
}))

//GET: /logout
router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/login')
})

//GET: /github
router.get('/github', passport.authenticate('github',{
    scope:['user:email']
}))

//GET: /github/callback
router.get('/github/callback', passport.authenticate('github',{
    failureRedirect:'/login'
}),(req,res)=>{
    res.redirect('/tasks')
})


module.exports = router;
