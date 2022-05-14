const mongoose = require('mongoose')

// Define Location schema
const Order_Schema = new mongoose.Schema({

    
   
    data: {
        type: String,
        
    },
    userid:{
        type: String,
        
    }
   
})
// Define Location model
module.exports = mongoose.model('students',Order_Schema )