var express = require('express');
var router = express.Router();
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
const urll = 'mongodb://127.0.0.1:27017';
var fs=require('fs');
var path=require('path');
var async=require('async');
// var  usersModel=require('./models/usersModel.js');
var usersModel = require('../models/usermodels.js');
var multer=require('multer');
var upload=multer({
    dest:'C:/tmp'
})

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
// 新增手机渲染
router.get('/list',function(req,res){
    var page=parseInt(req.query.page);
    var pageSize=parseInt(req.query.pageSize);
    var totalPage=0;
    res.set('Access-Control-Allow-Origin',"*");
    
    MongoClient.connect(urll,function(err,client){
        if(err){
           console.log("数据库连接失败");
            res.send({code:-1,msg:'获取列表失败'});
        }else{
            // 2个异步操作
            var db=client.db('yangqins');

            async.parallel([
                function(callback){
                    db.collection('imgs').find().count(function(err,num){
                        if(err){
                            callback({code:-1,msg:'error'});
                        }else{
                            totalPage=Math.ceil(num/pageSize);
                            callback(null);
                        }
                    })
                },
                function(callback){
                    // 分页查询
                    db.collection('imgs').find().limit(pageSize).skip(page*pageSize-pageSize).toArray(function(err,array){
                        if(err){
                            callback({code:-1,msg:'error'});
                        }else{
                            callback(null,array);
                        }
                    })

                }
            ],function(err,results){
                if(err){
                    res.send(err);
                }else{
                    res.send({code:0,msg:'查询成功',data:{
                        list:results[1],
                        totalPage:totalPage
                    }})
                }
                client.close();
            })
        }
    })
})



router.post('/add', upload.single('phoneImg'),function(req,res){
//    现将图片里给放到pblick目录下phones
console.log(123)
fs.readFile(req.file.path,function(err,filedata){
    if(err){
        console.log("读取文件失败")
        res.send({code:-1,msg:'新增手机失败'})
    }else{
        var fileName=new Date().getTime()+'_'+req.file.originalname;
        var dest_path=path.resolve(__dirname,'../public/phones',fileName);
        fs.writeFile(dest_path,filedata,function(err){
            if(err){
                console.log("写入文件失败");
                res.send({code:-1,msg:'新增手机失败'})
            }else{
                // 将数据写入数据库中
                MongoClient.connect(urll,function(err,client){
                    if(err){
                            console.log('新增数据库失败');
                            res.send({code:-1,msg:'新增手机失败'});
                    }else{
                        var db=client.db('yangqins');
                        var saveData=req.body;
                        saveData.fileName=fileName;
                        db.collection('imgs').insertOne(saveData,function(err){
                            if(err){
                                console.log('插入数据库失败');
                                res.send({code:-1,msg:'插入失败'});
                                
                            }else{
                                console.log('插入成功');
                                res.send({code:0,msg:'新增成功'});
                            }
                            client.close();
                        })
                    }
                })
            }
        })
    }
})

})

module.exports = router;