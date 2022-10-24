var express = require('express');
var router = express.Router();

var productHelpers = require('../helpers/product-helpers');

var adminHelpers = require('../helpers/adminhelpers');
const userHelpers = require('../helpers/user-helpers');
var adminLogin = require('../helpers/admin-login');
const e = require('express');


/* GET users listing. */
router.get('/', function (req, res, next) {

  if (req.session.loggedIn) {
    
    productHelpers.getAllProducts().then((products) => {
      res.render('admin/view_products', { products, user: req.session.loggedIn, admin: true, nav: true });
    });
  } else {
    res.redirect('admin/login')
  }


})

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/login', { loginErr: req.session.loginErr, user: req.session.loggedIn, nav: true })
  }
})


router.post('/login', (req, res) => {
  adminLogin.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.admin = response.admin;
      res.redirect('/admin');
    } else {
      
      



      
      res.redirect('/admin/login');
    }
  })
})

router.get('/add-products', (req, res) => {
  res.render('admin/add-products')
})

router.post('/add-products', (req, res) => {


  if (req.session.loggedIn) {
    productHelpers.addProducts(req.body, (insertedId) => {
      let image = req.files.Image
      const imgName = insertedId;
      console.log(imgName);
      image.mv('./public/product-images/' + imgName + '.jpg', (err, done) => {

        if (!err) {
          res.render("admin/add-products", { user: req.session.loggedIn,admin:true})
        } else {
          console.log(err)
        }
      })

    });
  } else {
    res.redirect('/admin')
  }

})


router.get('/view-user', (req, res) => {
  if (req.session.loggedIn) {
    adminHelpers.getAllUsers().then((users) => {
      console.log(users)
      res.render('admin/view-user', { users, user: req.session.loggedIn, admin: true });
    })
  } else {
    res.redirect('/admin')
  }
})

router.get('/add-users', (req, res) => {
  if (req.session.loggedIn) {
    res.render('admin/add-users', { user: req.session.loggedIn,admin:true });
  } else {
    res.redirect("/admin");
  }
})

router.post('/add-users', (req, res) => {
  if (req.session.loggedIn) {
    adminHelpers.addUser(req.body).then((data) => {
      // console.log(data)
      res.redirect('/admin/view-user')
    })
  } else {
    res.redirect("/admin");
  }

})



router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  console.log(userId)
  adminHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin/view-user')
  })
})

router.get('/edit-user/:id', async (req, res) => {
  if (req.session.loggedIn) {
    userId = await adminHelpers.getUserDetails(req.params.id)
    console.log(userId)
    res.render('admin/edit-user', { userId, user: req.session.loggedIn })
  } else {
    res.redirect("/admin");
  }
})


router.post('/edit-user/:id', (req, res) => {
  adminHelpers.editUser(req.params.id, req.body).then(() => {
    res.redirect('/admin/view-user')
  })
})


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
})


module.exports = router;
