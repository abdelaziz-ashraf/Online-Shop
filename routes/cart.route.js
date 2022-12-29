const router = require('express').Router()
const bodyParser = require('body-parser')
const { check, validationResult } = require("express-validator");

const authGaurd = require('./guards/auth.guard')

const cartController = require('../controllers/cart.controller')

router.get(
    '/', 
    authGaurd.isAuth, 
    cartController.getCart
)

router.post(
    '/', 
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    check('amount')
        .not().isEmpty().withMessage('Amount is required')
        .isInt({min: 1}).withMessage('Amount must be greater than 0'), 
    cartController.postCart
)

router.post(
    '/save', 
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    check('amount')
        .not().isEmpty().withMessage('Amount is required')
        .isInt({min: 1}).withMessage('Amount must be greater than 0'), 
    cartController.postSave
)

router.post(
    '/delete',
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    cartController.postDelete
)

router.post(
    '/deleteAll',
    authGaurd.isAuth, 
    bodyParser.urlencoded({extended: true}),
    cartController.postDeleteAll
)


module.exports = router  