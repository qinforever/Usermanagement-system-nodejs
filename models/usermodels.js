// 这里用来做user用户的操作数据库



const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';

const usersModel={
// //**
//  * 
//  * @param {object} data 
//  * @param {Function} cb 
//  */


// const data={

// }

    add(data){
        MongoClient.connect(url,function(err ,client){
            if(err) throw err;
            const db=client.db('yangqin');
        // 对data里面的isAdmin修改为is_admin
        // 写一个——id的为1
        // 下一个注册，先拿到之前的用户记录条数，+1写给写一个人
        // 用户名相同则不允许
        let data={
            username:data.username,
            password:data.password,
            nickname:data.nickname,
            phone:data.phone,
            is_admin:data.isAdmin
        }
        db.collection('user').find({username:data.username}).count(function(err,num){
            if(err) throw err;
            if(num==0){
                db.collection('user').find().count(function(err,num){
                    if(err) throw err;
                    data_id=num+1;
                    
                    db.collection('user').insertOne(data,function(err){
                        if(err) throw err;
                        cb(null);
        
                        client.close();
                    })
                })
            }else{
                cb("已经注册过了");
                client.close();
            }

        })
    
        })
    }
}


module.exports=usersModel;
