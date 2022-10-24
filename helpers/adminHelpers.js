var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const { ObjectID } = require('bson')
var objectId = require('mongodb').ObjectID

module.exports={
    addUser:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                 resolve(data.insertedId)
            })
           
        })
    },
    getAllUsers:()=>{
    return new Promise(async(resolve,reject)=>{
        let user=await db.get().collection(collection.USER_COLLECTION).find().toArray()
        resolve(user)
    })
},
deleteUser:(userId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
        //    console.log(response)
            resolve(response)
        })
    })
},
getUserDetails:(userId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((user)=>{
            resolve(user)
        })
    })
},
editUser:(userId,userDetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{
            $set:{
                username:userDetails.username,
                email:userDetails.email
            }
        }).then((response)=>{
            resolve()
        })
    })
},
}