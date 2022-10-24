var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).find({ email: userData.email }).toArray().then(async (hello) => {
                let response={}
                if (hello.length != 0) {
                    resolve({status:false})
                } else {
                    userData.password = await bcrypt.hash(userData.password, 10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                        response.value = userData
                        response.status = true
                        response.data = data.insertedId
                        resolve(response)
                    })


                }
            })



        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false

            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login succes')
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('failed');
                        resolve({ status: false })
                    }
                })

            } else {
                console.log('login failed');
                resolve({ status: false })
            }
        })
    },

}