var express = require('express');
var router = express.Router();
var usersModel = require('../models/usermodels.js');


// 首页
// 在首页中设置cookies
router.get('/', function(req, res, next) {
  if(req.cookies.username){
    res.render('index',{
      username:req.cookies.username,
      nickname:req.cookies.nickname,
      isAdmin:parseInt(req.cookies.isAdmin)?'管理员':''
    });
  }else{
    res.redirect('/login.html');
  }
});


// 注册页面
router.get('/register.html', function(req, res) {
  res.render('register');
});

// 登录页面
router.get('/login.html', function(req, res) {
  res.render('login');
})

// 用户管理页面
router.get('/user-manager.html', function(req, res) {
  // 同首页，需要判断是否用户登录，并且判断用户是否是管理员
  if (req.cookies.username && parseInt(req.cookies.isAdmin)) {
    // 需要查询数据库
    // 从前端取得2个参数
    let page = req.query.page || 1; // 页码
    let pageSize = req.query.pageSize || 5; // 每页显示的条数

    usersModel.getUserList({
      page: page,
      pageSize: pageSize
    }, function(err, data) {
      if (err) {
        res.render('werror', err);
      } else {

        console.log(data.userList);
        console.log('===================');

        res.render('user-manager', {
          username: req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '',

          userList: data.userList,
          totalPage: data.totalPage,
          searchPage: 0,
          page: data.page
        });
      }
    });



  } else {
    res.redirect('/login.html');
  }
})

// 手机管理页面
router.get('/mobile-manager.html', function(req, res) {
  // 同首页，需要判断是否用户登录，并且判断用户是否是管理员
  if (req.cookies.username && parseInt(req.cookies.isAdmin)) {
    res.render('mobile-manager', {
      username: req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '',
    });
  } else {
    res.redirect('/login.html');
  }
})




module.exports = router;
