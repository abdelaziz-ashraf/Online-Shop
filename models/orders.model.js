const mongoose = require('mongoose')

const DB_URL = 'mongodb://127.0.0.1:27017/online_shop'

const orderShema = mongoose.Schema({
    productName: String, 
    price: Number, 
    amount: Number, 
    userId: String,
    productId: String, 
    timestamp: Number, 
    address: String, 
    status: String
})

const Order = mongoose.model('order', orderShema)

exports.addNewOrder = order => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let item = new Order(order)
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

exports.addAllCarts = orders => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.insertMany(orders))
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

exports.getUserOrders = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.find({userId: userId}, {}, {sort:{timestamp: 1}}))
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

exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.deleteOne({_id: id}))
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

exports.cancelAllOrders = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.deleteMany({userId: userId, status: "Pending"}))
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

exports.getOrders = () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.find({}, {}, {sort: {timestamp: -1}}))
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

exports.getOrdersByStatus = (filter) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.find({status: filter}, {}, {sort: {timestamp: -1}}))
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

exports.getOrdersByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.find({userId: userId}, {}, {sort: {timestamp: -1}}))
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

exports.changeStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() =>
               Order.updateOne({_id: id}, {$set: status})
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