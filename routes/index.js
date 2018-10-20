var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.end();
});



router.get('/register',function(req,res){
  res.render("register");
  res.end();
})

router.get('/login',function(req,res){
  res.render("login");
  res.end();
})
module.exports = router;
