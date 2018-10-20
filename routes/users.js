var express = require('express');
var router = express.Router();
const usersModel=require('../models/usermodels.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// 注册的数据发送过来
router.post('/register',function(req,res){
  console.log(req.body)
  // 这里作验证，用户名必须是5到10的字符
  if( !/\w{5,10}/.test(req.body.username)){
      // res.render('yangerros',{code :-1,msg:'尊敬的用户你好您输入的用户名有误用户名必须是5到10位请重新输入'});
      res.send("用户名错误");

  }

//  操作数据库先安装
usersModel.add(req.body,function(err){
  if(err) throw err;
  res.render('login');
});


  res.send();
 res.end();
})



module.exports = router;
