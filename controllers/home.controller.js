const productsModel = require('../models/products.model')

exports.getHome = (req, res, next) => {
    let category = req.query.category
    let productsPromise

    if(category && category !== 'all')  productsPromise = productsModel.getProductsByCategory(category)
    else    productsPromise = productsModel.getAllProducts()

    productsPromise.then(products => {
        res.render('index', {
            products: products,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationError: req.flash('validationErrors')[0],
            pageTitle: 'Home'
        })
    })
}