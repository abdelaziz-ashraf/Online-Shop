const router = require('express').Router()
const bodyParser = require('body-parser')
const { check, validationResult } = require("express-validator");

const authGaurd = require('./guards/auth.guard')
const ordersController = require('../controllers/orders.controller')

router.get(
    '/',
    authGaurd.isAuth,
    ordersController.getOrders
)

router.post(
    '/verifyOrder', 
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    ordersController.postVerifyOrder
)

router.get(
    '/verifyOrder', 
    authGaurd.isAuth, 
    ordersController.getVerifyOrder
)

router.get(
    '/verifyAll', 
    authGaurd.isAuth, 
    ordersController.getVerifyAll
)

router.post(
    '/addOrder', 
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    check('address')
        .not().isEmpty().withMessage('Address is required'),
    ordersController.addOrder
)

router.post(
    '/addAllOrders', 
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    check('address')
        .not().isEmpty().withMessage('Address is required'),
    ordersController.addAllOrders
)

router.post(
    '/cancelOrder', 
    authGaurd.isAuth,
    bodyParser.urlencoded({extended: true}),
    ordersController.cancelOrder
)

router.post(
    '/cancelAllOrders', 
    authGaurd.isAuth,
    bodyParser.urlencoded({extended: true}),
    ordersController.cancelAllOrders
)

module.exports = router 