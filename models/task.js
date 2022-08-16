
const mongoose = require('mongoose')


const studentSchema = new mongoose.Schema({
    studentName: {
        type:String,
        required:true
    },
    Registration:{
        type:String,
        required:false
    }
    ,
    studentNumber:{
        type:String,
        required:false
    }

})

module.exports = mongoose.model('Student', studentSchema)