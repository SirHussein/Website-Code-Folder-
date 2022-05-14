const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Item = require('../models/Item');
const User = require('../models/User');

//Orders page 
router.get('/orders', ensureAuthenticated, (req, res) =>{
Item.find({}, function(err,items) {
  res.render('orders' , {Item: items, user: req.user})
})
})

//Update order status page
router.get('/orderStatus/:id',ensureAuthenticated,(req, res, next) => {
  
  Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
      if(err){
        console.log("erro there")
        next(err)
      }
      else{
        //console.log(docs)
        res.render('orderStatus',{Item: docs} )
      }
  })
 
})


//Update order status
router.post('/orderStatus/:id',ensureAuthenticated,  async (req, res, next) => {

await Item.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
    if(err){
      console.log("error here")
      next(err)
    }
    else{
      res.redirect('/delivery/orders')
  }
})

})

 


module.exports = router;

  