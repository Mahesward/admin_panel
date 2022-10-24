var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')

var productHelpers = require('../helpers/product-helpers');

/* GET home page. */
router.get('/', function (req, res, next) {

  productHelpers.getAllProducts().then((products) => {
    // console.log(products)
    res.render('users/view-products', { products,user:req.session.user,user:req.session.loggedIn});
  })
});

router.get('/login', (req, res) => {
  if(req.session.user)
  res.redirect('/')
  else
  res.render('users/login',{loginErr: req.session.loginErr})
})

router.get('/signup', (req, res) => {
  if(req.session.user)
  res.redirect('/')
  else
  res.render('users/signup')
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response)=>{
    // console.log(response)
    if(response.status){
     res.send({ll: 'login successful'}) 
    }else{
      res.send({ll: 'email already exists'})
    }
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr = true;
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('login')
})

module.exports = router;
