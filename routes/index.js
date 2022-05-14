const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Item = require('../models/Item');
const User = require('../models/User');



// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Home Page
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
   
if(req.user.email =="admin1@admin"){
  res.redirect('/adminHome')
}
else if (req.user.email =="Delivery@Delivery") {
  res.redirect('/deliveryHome')
}
else{
res.render('dashboard', {
  user: req.user
})
}
});

//Admin home page
router.get('/adminHome', ensureAuthenticated, (req, res) =>{
  res.render('adminHome', {
    user: req.user
  })
})

//Delivery Home Page
router.get('/deliveryHome', ensureAuthenticated, (req, res) =>{
  res.render('deliveryHome', {
    user: req.user
  })
})


//User booked Item Page
router.get('/MyBooking', ensureAuthenticated, (req, res) => {
   Item.find({taker: req.user.name}, function(err,items) {
       res.render('MyBooking' , {Item: items})
   })
 })



//Items Page
router.get('/Item', ensureAuthenticated, (req, res) =>
Item.find({}, function(err,items) {
  res.render('Item' , {Item: items})
})
 
);

//Items Mangment
router.get('/MyItem', ensureAuthenticated, (req, res) => {
  
  Item.find({giver: req.user.name}, function(err,items) {
      res.render('MyItem' , {Item: items})
  })
})

//Items Mangment admin(M)//
router.get('/adminItem', ensureAuthenticated, (req, res) => {
  
  Item.find( {}, function(err,items) {
      res.render('adminItem' , {Item: items})
  })
})

//User Mangment admin(M)//
router.get('/adminUser', ensureAuthenticated, (req, res) => {
  
  User.find( {}, function(err,user) {
      res.render('adminUser' , {User: user})
  })
})

// Delete User admin(M)
router.get('/DeleteUser/:name', ensureAuthenticated, async (req, res) => {
  await User.deleteOne( {name: req.params.name}, function(err,user) {
})
res.redirect("/adminUser")
});


//
router.get('/addUser', ensureAuthenticated, (req, res) =>{
  res.render('addUser')
}
);

//
router.post('/id', ensureAuthenticated, (req, res) =>{
  const id =req.body
  const Newid = new access({
    id
    
  })

  Newid.save().then(user => {
      res.redirect('/Item');
    
})
.catch(err => console.log(err));

 
  res.render('addUser')
});


//Add new user
router.post('/addUser',ensureAuthenticated, async(req, res) => {
  const { name, email, password, division } = req.body;
  let errors = [];
  
  if (!name ) {
    errors.push({ msg: 'Please enter Name' });
  }
  if (!email) {
    errors.push({ msg: 'Please Choose category' });
  }
  if (!password) {
    errors.push({ msg: 'Please Choose category' });
  }
  if (!division) {
    errors.push({ msg: 'Please enter Item division' });
  }

  if (errors.length > 0) {
    res.render('addUser', {
      errors,
      name,
      email,
      password,
      division
    });
  } else{
    const NewUser = new User({
      name,
      email,
      password,
      division
      
    })

     NewUser.save().then(user => {
        req.flash('success_msg',' New user is added ' );
        res.redirect('/adminUser');
      
  })
  .catch(err => console.log(err));

} 
})

//Update user page
router.get('/UpdateUser/:id',ensureAuthenticated,(req, res, next) => {
  
  User.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
      if(err){
        console.log("erro there")
        next(err)
      }
      else{
        console.log(docs)
        res.render('UpdateUser',{User: docs} )
      }
  })
 
})


//Update use
router.post('/UpdateUser/:id',ensureAuthenticated,  async (req, res, next) => {

await User.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
    if(err){
      console.log("error here")
      next(err)
    }
    else{
      //console.log(docs)
      User.find({}, function(err,user) {
        res.render('adminUser' , {User: user})
      })
  }
})

})


//Uplode Item  page
router.get('/Uplode', ensureAuthenticated, (req, res) =>{
  res.render('Uplode')
}
);

//Uplode Item  
router.post('/Uplode', async(req, res) => {
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
    res.render('Uplode', {
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
        res.redirect('/MyItem');
      
  })
  .catch(err => console.log(err));

} 
})

//Update Item  page
router.get('/UpdateBooking/:id',ensureAuthenticated,(req, res, next) => {
  
  Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
      if(err){
        console.log("erro there")
        next(err)
      }
      else{
        res.render('UpdateBooking',{Item: docs} )
      }
  })
 
})

//Update Item  
router.post('/UpdateBooking/:id',  ensureAuthenticated, async (req, res, next) => {
  
  await Item.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
      if(err){
        console.log("error here")
        next(err)
      }
      else{
        res.redirect('/MyBooking');
    }
  })
 
})


//cancel booking page
router.get('/CancelBooking/:id',ensureAuthenticated,(req, res, next) => {
  
  Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
      if(err){
        console.log("erro there")
        next(err)
      }
      else{
        res.render('CancelBooking',{Item: docs} )
      }
  })
 
})

//cancel booking
router.post('/CancelBooking/:id', ensureAuthenticated, async (req, res, next) => {
  
  await Item.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
      if(err){
        console.log("error here")
        next(err)
      }
      else{
        res.redirect('/MyBooking')
    }
  })
 
})

//update booking page
router.get('/UpdateBooking/:id',ensureAuthenticated,(req, res, next) => {
  
  Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
      if(err){
        console.log("erro there")
        next(err)
      }
      else{
        res.render('UpdateBooking',{Item: docs} )
      }
  })
 
})

//delete item page
router.get('/DeleteItem/:id', getItemID,ensureAuthenticated, async (req, res) => {
  try {
    await res.item.delete()
    res.redirect("/MyItem")
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  
})

//New item Book page
router.get('/Book/:id', ensureAuthenticated,  (req, res, next) => {
  Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
      if(err){
        console.log("erro there")
        next(err)
      }
      else{
        res.render('Book',{Item: docs, user: req.user} )
      }
  })
 
})


//New item Book 
router.post('/Book/:id',  ensureAuthenticated,getItem,async (req, res, next) => {

await Item.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
    if(err){
      console.log("error here")
      next(err)
    }
    else{
      Item.find({}, function(err,items) {
        res.render('Item' , {Item: items,user: req.user})
        req.flash('success_msg', 'You Booked Item')
      })
  }
})

})


//update booked item page
router.get('/UpdateItem/:id',ensureAuthenticated,(req, res, next) => {
  
    Item.findOneAndUpdate({_id: req.params.id}, req.body,{new:true},(err,docs)=>{
        if(err){
          console.log("erro there")
          next(err)
        }
        else{
          res.render('UpdateItem',{Item: docs} )
        }
    })
   
})


//update booked item 
router.post('/UpdateItem/:id',ensureAuthenticated,  async (req, res, next) => {
  
  await Item.findByIdAndUpdate({_id: req.params.id}, req.body,(err,docs)=>{
      if(err){
        console.log("error here")
        next(err)
      }
      else{
        Item.find({}, function(err,items) {
          res.render('MyItem' , {Item: items})
        })
    }
  })
 
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

