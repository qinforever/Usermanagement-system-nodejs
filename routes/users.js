var express = require('express');
var router = express.Router();
const usersModel=require('../models/usermodels.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 注册的数据发送过来
router.post('/register',function(req,res){
  // console.log(req.body)
  // 这里作验证，用户名必须是5到10的字符
  if(!/^\w{5,10}$/.test(req.body.username)){
      // res.render('yangerros',{code :-1,msg:'尊敬的用户你好您输入的用户名有误用户名必须是5到10位请重新输入'});
      res.send("用户名错误");
    return;
  }

//  操作数据库先安装
  usersModel.add(req.body,function(err){
    if(err){
      res.render('yangerros',err);
    }else{
      res.redirect('/login.html');
    }
  })

})

// 登录处理
router.post('/login',function(req,res){
  usersModel.login(req.body,function(err,data){
    if(err){
      res.render('yangerros',err);
    }else{
      console.log('当前的用户信息是',data);
      // 写入cookies设置时间
      res.cookie('username',data.username,{
        maxAge: 1000 * 60 * 1000000, // 单位是毫秒，
      })
      res.cookie('nickname',data.nickname,{
        maxAge: 1000 * 60 * 1000000, // 单位是毫秒，
      })
      res.cookie('isAdmin',data.isAdmin,{
        maxAge: 1000 * 60 * 1000000, // 单位是毫秒，
      })
      // 跳到首页
      res.redirect('/');
    }
  })
})

// 退出登录
router.get('/logout',function(req,res){
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');
  res.redirect('/login.html');
})

router.post('/update', function(req, res) {
  console.log('用户修改接口处理代码');
  console.log(req.body);

  usersModel.update(req.body, function(err) {
    if (err) {
      // res.render('werror', err);
      // ajax
      res.send(err);
    } else {
      console.log('成功了');
      res.send({code: 0, msg: '成功了'});
    }
  })
})


// 删除操作
router.post("/removes",function(req,res){
  console.log(req.body)
  usersModel.removes(req.body,function(err){
    if(err){
      res.send(err);
    }else{
      res.send({code: 0, msg: '删除成功了'});
    }
  })
})


module.exports = router;
