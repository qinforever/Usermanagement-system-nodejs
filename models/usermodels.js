// 这里用来做user用户的操作数据库



const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');
const usersModel = {
    // //**
    //  * 
    //  * @param {object} data 
    //  * @param {Function} cb 
    //  */


    // const data={

    // }

    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -1, msg: '数据库连接失败' });
                return;
            };
            const db = client.db('yangqin');
            // 对data里面的isAdmin修改为is_admin
            // 写一个——id的为1
            // 下一个注册，先拿到之前的用户记录条数，+1写给写一个人
            // 用户名相同则不允许
            let datas = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin
            };

            async.series([
                function (callback) {
                    // 查询是否已注册
                    db.collection('user').find({ username: datas.username }).count(function (err, num) {
                        if (err) {
                            callback({ code: -101, msg: '查询是不是已注册失败' });
                        } else if (num !== 0) {
                            console.log('用户已经注册过了');
                            callback({ code: -102, msg: "用户已经注册过了" })
                        } else {
                            console.log('当前用户可以注册');
                            callback(null);
                        }
                    })
                },
                // 查询的记录条数
                function (callback) {
                    db.collection('user').find().sort({_id:-1}).toArray(function (err, data) {
                        if (err) {
                            callback({ code: -101, msg: '查询所有用户记录失败' });
                        } else if (data.length === 0) {

                            datas._id = 1;
                            callback(null);
                        } else {
                            datas._id = data[0]._id + 1;
                            callback(null);
                        }
                    })
                },
                // 加入数据库显示
                function (callback) {
                    db.collection('user').insertOne(datas, function (err) {
                        if (err) {
                            callback({ code: -101, msg: '加入数据库失败' });
                        } else {
                            callback(null);
                        }
                    })
                }
            ], function (err, results) {
                // 不管上面异步是否成功，都会进入到这个回调函数里面
                if (err) {
                    console.log("上面操作失败", err);
                    cb(err);
                } else {
                    cb(null)
                }
                client.close();
            })
            // db.collection('user').find({username:data.username}).count(function(err,num){
            //     if(err) throw err;
            //     if(num==0){
            //         db.collection('user').find().count(function(err,num){
            //             if(err) throw err;
            //             data_id=num+1;

            //             db.collection('user').insertOne(data,function(err){
            //                 if(err) throw err;
            //                 cb(null);

            //                 client.close();
            //             })
            //         })
            //     }else{
            //         cb("已经注册过了");
            //         client.close();
            //     }
            // })
        })
    },
    // 登录的方法及验证
    login(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -101, msg: '数据库连接失败' });
            } else {
                const db = client.db('yangqin');
                db.collection('user').find({
                    username: data.username,
                    password: data.password
                }).toArray(function (err, data) {
                    if (err) {
                        console.log('匹配数据库失败');
                        cb({ code: -102, msg: '用户名或密码错误' });
                    } else {
                        console.log('用户名登录成功');
                        // 这里需要把用户名，昵称，是否是管理员这几个字段传递给前端
                        cb(null, {
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isAdmin: data[0].is_admin
                        });
                    }
                    client.close();
                })
            }
        })
    },
    /**
      * 获取用户列表
      * @param {Object} data 页码信息与每页显示条数信息
      * @param {Function} cb 回调函数
      */
    getUserList(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -100, msg: '链接数据库失败' });
            } else {
                var db = client.db('yangqin');

                var limitNum = parseInt(data.pageSize);
                var skipNum = data.page * data.pageSize - data.pageSize;

                async.parallel([
                    function (callback) {
                        // 查询所有记录
                        db.collection('user').find().count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库失败' });
                            } else {
                                callback(null, num);
                            }
                        })
                    },

                    function (callback) {
                        // 查询分页的数据
                        db.collection('user').find().limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, results) {
                    if (err) {
                        cb(err);
                    } else {
                        console.log(results[1]);
                        console.log('-----------------------');
                        cb(null, {
                            totalPage: Math.ceil(results[0] / data.pageSize),
                            userList: results[1],
                            page: data.page,
                        })
                    }

                    // 关闭连接
                    client.close();
                })

                // db.collection('users').find().limit(data.pageSize).skip(skipNum).toArray(function(err, data) {
                //   if (err) {
                //     cb({code: -101, msg: '查询数据库失败'});
                //   } else {
                //     cb(null, {})
                //   }
                // })
            }
        })
    },
    search(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                cb({ code: -101, msg: '链接数据库失败' });
            } else {
                var db = client.db('yangqin');
                async.parallel([
                    function (callback) {
                        // 查询所有记录
                        db.collection('user').find({ 'nickname': eval('/' + data.nick + '/') }).count(function (err, num) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库失败' });
                            } else {
                                callback(null, num);
                            }
                        })
                    },
                    function (callback) {

                        var limitNum = parseInt(data.pageSize);
                        var skipNum = data.page * data.pageSize - data.pageSize;
                        db.collection('user').find({ 'nickname': eval('/' + data.nick + '/') }).limit(limitNum).skip(skipNum).toArray(function (err, data) {
                            if (err) {
                                callback({ code: -101, msg: '查询数据库失败' });
                            } else {
                                callback(null, data);
                            }
                        })
                    }
                ], function (err, results) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, {
                            totalPage: Math.ceil(results[0] / data.pageSize),
                            userList: results[1],
                            page: data.page,
                        })
                    }
                    client.close();
                })

            }
        })
        // 查询您数据库修改
        // updatas(data,cb){
        //     MongoClient.connect(url,function(err,client){
        //     fgfg
        //     })


    },


    /**
     * 修改用户信息
     * @param {Object} data 传递得参数
     * @param {Function} cb 回调汉书
     */
    update(data, cb) {
        MongoClient.connect(url, function(err, client) {
            if (err) {
                cb({code: -100, msg: '连接数据库失败'});
            } else {
                var db = client.db('yangqin');

                db.collection('user').updateOne({_id: parseInt(data.sid)}, {
                    $set: {
                        nickname: data.niname,
                        phone: data.phones,
                        is_admin: data.is_admins
                    }
                }, function(err) {
                    if (err) {
                        cb({code: -101, msg: '修改用户失败'});
                    } else {
                        cb(null);
                    }

                    client.close();
                })
            }
        })
    },
 /**
     * 删除用户信息
     * @param {Object} data 传递得参数
     * @param {Function} cb 回调汉书
     */
    removes(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err){
                cb({code:-100,msg:'连接数据库失败'});
            }else{
                var db=client.db('yangqin');
                db.collection('user').remove({_id:parseInt(data.ids)},function(err){
                    if (err) {
                        cb({code: -101, msg: '删除用户失败'});
                    } else {
                        cb(null);
                    }
                    client.close();
                })
            }
        })
    }
}


module.exports = usersModel;
