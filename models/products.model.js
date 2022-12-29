const mongoose = require('mongoose')

const DB_URL = 'mongodb://127.0.0.1:27017/online_shop'

const productSchema = mongoose.Schema({
    name: String, 
    image: String, 
    price: Number, 
    description: String, 
    category: String
})


const Product = mongoose.model('product', productSchema)

exports.getAllProducts = () => {
  
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Product.find({})
        }).then(products => {
            mongoose.disconnect()
            resolve(products)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getProductsByCategory = (category) => {

    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Product.find({category: category})
        }).then(products => {
            mongoose.disconnect()
            resolve(products)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getProductById = id => {
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Product.findById(id)
        }).then(products => {
            mongoose.disconnect()
            resolve(products)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })   
}

exports.getFirstProduct = () => {
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return Product.findOne()
        }).then(products => {
            mongoose.disconnect()
            resolve(products)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })  
} 

exports.addProduct = product => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let item = new Product(product)
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