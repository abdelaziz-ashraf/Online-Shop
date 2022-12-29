const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

const DB_URL = 'mongodb://127.0.0.1:27017/online_shop'

const userSchema = mongoose.Schema({
    username: String, 
    email: String,
    password: String, 
    isAdmin: {
        type: Boolean, 
        default: false
    }
})

const User = mongoose.model('user', userSchema)

exports.createNewUser = (username, email, password) => {
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return User.findOne({email: email})
        }).then(user =>{
            if(user) { 
                mongoose.disconnect()
                reject('email is used')
            }
            else{
                return bcrypt.hash(password, 10)
            }
        }).then(hashedPassword => {
            let user = new User({
                username: username, 
                email: email, 
                password: hashedPassword,
            })
            return user.save()
        }).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.login = (email, password) => {  
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => User.findOne({email: email})).then((user) => {
            if(!user){
                mongoose.disconnect()
                reject('There is no user matches this email.')
            } else {
                bcrypt.compare(password, user.password).then(same => {
                    if(!same){
                        mongoose.disconnect()
                        reject('Incorrect password.')
                    } else {
                                                            
                        mongoose.disconnect()
                        resolve({
                            id: user._id, 
                            isAdmin: user.isAdmin
                        })
                    }
                })
            }
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getUserEmail = email => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => User.findOne({email: email}))
            .then(item => {
                mongoose.disconnect()
                resolve(item)
            })
            .catch(err => {
                mongoose.disconnect()
                reject(err)
            })
    })
}