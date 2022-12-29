const ordersModel = require('../models/orders.model')
const { check, validationResult } = require('express-validator')

const cartModel = require('../models/cart.model')
const { render } = require('ejs')

exports.postVerifyOrder = (req, res, next) => {
    cartModel
        .getItemById(req.body.cartId)
        .then( cart =>{
            req.flash('cart')
            req.flash('cart', cart)
            res.redirect('/orders/verifyOrder')
        })
        .catch(err => res.redirect('/error'))
}

exports.getVerifyOrder = (req, res, next) => {
    const cart = req.flash('cart')[0]
    req.flash('cart', cart)
    res.render('verifyOrder', {
        isUser: true, 
        isAdmin: req.session.isAdmin,
        cart: cart,
        addressError: req.flash('addressError')[0], 
        pageTitle: 'Verify order'
    })
}

exports.getVerifyAll = (req, res, next) => {
    res.render('verifyAll', {
        isUser: true, 
        isAdmin: req.session.isAdmin,
        addressError: req.flash('addressError')[0], 
        pageTitle: 'Verify All Orders'
    })
}

exports.addOrder = (req, res, next) => {
    if(validationResult(req).isEmpty()){
        const order = {
            productName: req.body.name, 
            price: req.body.price, 
            amount: req.body.amount, 
            userId: req.session.userId,
            productId: req.body.productId, 
            timestamp: Date.now(), 
            address: req.body.address, 
            status: 'Pending'
        }
        ordersModel
            .addNewOrder(order)
            .then(() => {
                cartModel
                    .deleteItem(req.body.cartId)
                    .then(() => res.redirect('/orders'))
                    .catch(err => res.redirect('/error'))
            })
            .catch(err => res.redirect('/error'))
    }
    else{
        req.flash('addressError', validationResult(req).array())
        res.redirect('/orders/verifyOrder')
    }
    
}

exports.addAllOrders = (req, res, next) => {
    if(validationResult(req).isEmpty()){
        cartModel.getItemByUser(req.session.userId).then(items => {
            const listOfOrders = items.map(item => ({
                productName: item.name, 
                price: item.price, 
                amount: item.amount, 
                userId: req.session.userId,
                productId: item.productId, 
                timestamp: Date.now(), 
                address: req.body.address, 
                status: 'Pending'
            }))
            
            const listOfIds = items.map(item => item._id)
            
            ordersModel
                .addAllCarts(listOfOrders)
                .then(() => {
                    cartModel
                        .deleteAllCarts(listOfIds)
                        .then(() => res.redirect('/orders'))
                        .catch(err => res.redirect('/error'))
                })
                .catch(err => res.redirect('/error'))
        
        }).catch(err => res.redirect('/error'))
    }
    else{
        req.flash('addressError', validationResult(req).array())
        res.redirect('/orders/verifyAllOrders')
    }
    
}

exports.getOrders = (req, res, next) => {
    ordersModel.getUserOrders(req.session.userId).then(items => {
        res.render('orders', {
            items: items, 
            isUser: true,
            isAdmin: req.session.isAdmin,
            pageTitle: 'Orders'
        })
    }).catch(err => res.redirect('/error'))
}

exports.cancelOrder = (req, res, next) => {
    ordersModel
        .cancelOrder(req.body.orderId)
        .then(() => res.redirect('/orders'))
        .catch(err => {
            res.redirect('/error')
        })
}

exports.cancelAllOrders = (req, res, next) => {
    ordersModel
        .cancelAllOrders(req.session.userId)
        .then(() => res.redirect('/orders'))
        .catch(err => {
            res.redirect('/error')
        })
}