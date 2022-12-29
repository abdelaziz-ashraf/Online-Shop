const cartModel = require('../models/cart.model')
const { check, validationResult } = require('express-validator')

exports.getCart = (req, res, next) => {
    cartModel.getItemByUser(req.session.userId).then(items => {
        res.render('cart', {
            items: items, 
            isUser: true, 
            isAdmin: req.session.isAdmin,
            pageTitle: 'Cart',
            validationError: req.flash('validationErrors')[0]
        })
    }).catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    if(validationResult(req).isEmpty()){
        cartModel.getCartByProduct(req.body.productId).then(cart => {
            cartModel.editItem(cart._id, {
                amount: (Number(req.body.amount) + Number(cart.amount)), 
                timestamp: Date.now()
            }).then(() => {
                res.redirect('/cart')
            }).catch(err => {
                res.redirect('/error')
            })
        }).catch(err => {
            cartModel.addNewItem({
                name: req.body.name, 
                price: req.body.price, 
                amount: req.body.amount, 
                productId: req.body.productId, 
                userId: req.session.userId, 
                timestamp: Date.now()
            }).then(() => {
                res.redirect('/cart')
            }).catch(err => {
                res.redirect('/error')
            })
        })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect(req.body.redirctTo)
    }
}

exports.postSave = (req, res, next) => {
    if(validationResult(req).isEmpty()){
        cartModel.editItem(req.body.cartId, {
            amount: req.body.amount, 
            timestamp: Date.now()
        })
        .then(() => res.redirect('/cart'))
        .catch(err => res.redirect('/error'))
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/cart')
    }
}

exports.postDelete = (req, res, next) => {
    cartModel
        .deleteItem(req.body.cartId)
        .then(() => res.redirect('/cart'))
        .catch(err => res.redirect('/error'))
}

exports.postDeleteAll = (req, res, next) => {
    cartModel.getItemByUser(req.session.userId).then(items => {
        const listOfIds = items.map(item => item._id)
        cartModel
            .deleteAllCarts(listOfIds)
            .then(() => res.redirect('/cart'))
            .catch(err => res.redirect('/error'))
    }).catch(err => res.redirect('/error'))
}
