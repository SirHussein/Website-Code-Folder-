const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Item = require('../models/Item');
const User = require('../models/User');
const locations = require('../models/location');


//Items Mangment admin
router.get('/adminItem', ensureAuthenticated, (req, res) => {
  
    Item.find( {}, function(err,items) {
        res.render('adminItem' , {Item: items})
    })
  })
  
  //User Mangment admin
  router.get('/adminUser', ensureAuthenticated, (req, res) => {
    
    User.find( {}, function(err,user) {
        res.render('adminUser' , {User: user})
    })
  })

  // Delete User admin
  router.get('/DeleteUser/:name', ensureAuthenticated,async (req, res) => {
    await User.deleteOne( {name: req.params.name}, function(err,user) {
  })
  res.redirect("/adminUser")
  });

 //Update Item admin
  router.get('/UpdateItemadmin/:id',ensureAuthenticated,(req, res, next) => {
  
    Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
        if(err){
          console.log("erro there")
          next(err)
        }
        else{
          
          res.render('UpdateItemadmin',{Item: docs} )
        }
    })
   
})
//Update Item (extend Date)
router.post('/UpdateItem/:id',ensureAuthenticated,  async (req, res, next) => {
  
  await Item.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
      if(err){
        console.log("error here")
        next(err)
      }
      else{
       
        Item.find({}, function(err,items) {
          res.render('adminItem' , {Item: items})
        })
    }
  })
 
})

//Item All Inforamtion 
router.get('/moreinfo/:id',ensureAuthenticated,(req, res, next) => {
  
    Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
        if(err){
          console.log("erro there")
          next(err)
        }
        else{
          
          res.render('moreinfo',{Item: docs} )
        }
    })
   
})

//Delete Item Page
router.get('/DeleteItemadmin/:id', getItemID,ensureAuthenticated, async (req, res) => {
    try {
      await res.item.delete()
      res.redirect("/admin/adminItem")
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
    
  })
  

//Live location page
router.get('/location', ensureAuthenticated, (req, res) => {
           
    locations.find( {}, function(err,locationCar) {
        res.render('location' , {locations: locationCar})
    })
        
})

//Add new User
router.get('/uplodeAdmin', ensureAuthenticated, (req, res) =>{
    res.render('uplodeAdmin')
  }
  );
  
  router.post('/uplodeAdmin',ensureAuthenticated, async(req, res) => {
    const { name, category, location } = req.body;
    let errors = [];
    
    if (!name ) {
      errors.push({ msg: 'Please enter Name' });
    }
    if (!category) {
      errors.push({ msg: 'Please Choose category' });
    }
    if (!location) {
      errors.push({ msg: 'Please enter Item location' });
    }
  
    if (errors.length > 0) {
      res.render('uplodeAdmin', {
        errors,
        name,
        category,
        location
      });
    } else{
      const NewItem = new Item({
        name,
        category,
        location,
        giver: req.user.name
        
      })
  
       NewItem.save().then(user => {
          req.flash('success_msg','You Item is added ' );
          res.redirect('/admin/adminItem');
        
    })
    .catch(err => console.log(err));
  
  } 
  })



async function getItemID(req, res, next) {
    let item
    try {
      item = await Item.findById(req.params.id)
      if (item == null) {
        return res.status(404).json({ message: 'Cannot find Item' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.item = item
    next()
  }
  

  module.exports = router;


  
  