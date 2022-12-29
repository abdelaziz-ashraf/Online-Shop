const productsModel = require('../models/products.model')
const ordersModel = require('../models/orders.model')
const authModel = require('../models/auth.model')
const { validationResult } = require("express-validator")

exports.getAdd = (req, res, next) => {
    res.render('add-product', {
        validationErrors: req.flash('validationErrors'),
        isUser: true, 
        isAdmin: true, 
        pageTitle: 'Add Product'
    })
}

exports.postAdd = (req, res, next) => {
    if(validationResult(req).isEmpty()){

        const product = {
            name: req.body.name, 
            image: req.file.filename, 
            price: req.body.price, 
            description: req.body.description, 
            category: req.body.category
        }

        productsModel
            .addProduct(product)
            .then(() => res.redirect('/'))
            .catch(err =>  res.redirect('/error'))
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/admin/add')
    }
}

exports.getOrders = (req, res, next) => {
    ordersModel.getOrders().then((orders) => {
        res.render('manage-orders', {
            orders: orders, 
            isUser: true, 
            isAdmin: true,
            validationError: req.flash('validationError')[0], 
            NoUser: req.flash('NoUser')[0], 
            pageTitle: 'Manage Orders'
        })
    })
}

exports.getOrdersByStatus = (req, res, next) => {

    let DBFilter 
    if(req.body.filter === 'All')   DBFilter = ordersModel.getOrders()
    else    DBFilter = ordersModel.getOrdersByStatus(req.body.filter)

    DBFilter.then((orders) => {
        res.render('manage-orders', {
            orders: orders,  
            isUser: true, 
            isAdmin: true,
            validationError: req.flash('validationError')[0],
            NoUser: false, 
            pageTitle: 'Manage Orders'
        })
    }).catch(err => res.redirect('/error'))
}

exports.getOrdersByUser = (req, res, next) => {

    if(validationResult(req).isEmpty()){
        authModel.getUserEmail(req.body.email).then(user => {
            if(user) {
                ordersModel.getOrdersByUser(user._id).then((orders) => {
                    res.render('manage-orders', {
                        orders: orders, 
                        isUser: true, 
                        isAdmin: true,
                        validationError: req.flash('validationError')[0],
                        NoUser: false, 
                        pageTitle: 'Manage Orders'
                    })
                })
            }
            else {
                req.flash('NoUser', true)
                res.redirect('/admin/orders')
            }
        }).catch(err => {
            res.redirect('/admin/orders')
        })
    } else {
        req.flash('validationError', validationResult(req).array())
        req.flash('NoUser', false)
        res.redirect('/admin/orders')
    }
}

exports.changeStatus = (req, res, next) => {
    const orderId = req.body.orderId
    const status = {status: req.body.status}
    ordersModel
        .changeStatus(orderId, status)
        .then(() => res.redirect('/admin/orders'))
        .catch(err => {
            res.redirect('/error')
        })
}