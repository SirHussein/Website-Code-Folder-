const mongoose = require('mongoose')


// Define Item schema
const Event_Schema = new mongoose.Schema({

    
    name:{
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    Zone: {
        type: String,
        
    }, location : {
        type: String,
    },
    avaliablity:{
        type: Boolean,
        default: true
    },
    giver:{
        type: String,
        
    },
    taker: {
        type: String
    },
    bookdate:{
        type: Date 
    },
    returndate:{
        type: Date 
    },
    destnation:{
        type: String
    },
    delivery:{
        type: String
    },
     status:{
        type: String,
        default: "In warehouse"
    },
    id:{
        type: Number
    }
  
    
    
})
// Define Item model
module.exports = mongoose.model('Item',Event_Schema)