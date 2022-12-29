const mongoose = require('mongoose')

const DB_URL = 'mongodb://127.0.0.1:27017/online_shop'

const cartShema = mongoose.Schema({
    name: String, 
    price: Number, 
    amount: Number, 
    userId: String,
    productId: String, 
    timestamp: Number
})

const CartItem = mongoose.model('cart', cartShema)


exports.addNewItem = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let item = new CartItem(data)
                return item.save()
            })
            .then(() => {
                mongoose.disconnect()
                resolve()
            })
            .catch( err => {
                mongoose.disconnect()
                reject(err)
            })
    })
}

exports.getItemByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.find({userId: userId}, {}, {sort:{timestamp: 1}}))
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

exports.getCartByProduct = productId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.findOne({productId: productId}))
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

exports.getItemById = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() =>
               CartItem.findById(id)
            )
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

exports.editItem = (id, newData) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() =>
               CartItem.updateOne({_id: id}, {$set: newData})
            )
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

exports.deleteItem = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.deleteOne({_id: id}))
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

exports.deleteAllCarts = listOfCarts => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.deleteMany({_id: {$in: listOfCarts}}))
            .then(items => {
                mongoose.disconnect()
                resolve(items)
            })
            .catch(err => {
                mongoose.disconnect()
                reject(err)
            }) 
    })
}