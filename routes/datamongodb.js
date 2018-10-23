var express = require('express');
var router = express.Router();
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
const urll = 'mongodb://127.0.0.1:27017';
// var  usersModel=require('./models/usersModel.js');
var usersModel = require('../models/usermodels.js');

// localhost:3000/datamongodb/user-manger
router.get('/user-manager',function(req,res){
    var nick=url.parse(req.url,true).query.nick;
    let page = req.query.page || 1; // 页码
    let pageSize = req.query.pageSize || 1; // 每页显示的条数
    usersModel.search({
        nick:nick,
        page: page,
        pageSize: pageSize
    },function(err,data){
        if(err){
            res.render('yangerros',err)
        }else{
            console.log(data.userList);
            res.render('user-manager', {
                username: req.cookies.username,
                nickname: req.cookies.nickname,
                isAdmin: parseInt(req.cookies.isAdmin) ? '(管理员)' : '',
                userList: data.userList,
                searchPage: data.totalPage,
                totalPage:0,
                nick:nick,
                page: data.page
              })
        }
    });
});

module.exports = router;