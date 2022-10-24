var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('../app')
const { ObjectID } = require('bson')

var objectId = require('mongodb').ObjectID

module.exports={
addProducts: (product, callback) => {

    db.get().collection('product').insertOne(product).then((data) => {
        callback(data.insertedId)
       
    })
    .catch((err)=>console.log('venk error',err))

    
},
getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(products)
    })
},
deleteProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
            // console.log(response)
            resolve(response)
        })
    })
}
}