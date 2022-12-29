const router = require('express').Router()
const bodyParser = require('body-parser');
const { check } = require("express-validator");
const multer = require('multer')
const adminController = require('../controllers/admin.controller')
const adminGuard = require('./guards/admin.guard')


router.get(
    '/add', 
    adminGuard, 
    adminController.getAdd
)

router.post(
    '/add', 
    adminGuard, 
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'images')
            }, 
            filename: (req, file, cb) => {
                cb(null, Date.now()+'-'+file.originalname)
            }
        })
    }).single('image'),
    check('image')
        .custom((value, {req}) => {
            if(req.file) return true
            else throw 'image is required'
        }),
    check('name')
        .not().isEmpty().withMessage('Name is required'),
    check('description')
        .not().isEmpty().withMessage('Description is required'),
    check('price')
        .not().isEmpty().withMessage('Price is required')
        .isInt({min: 1}).withMessage('Price must be greater than 0'),
    check('category')
    .not().isEmpty().withMessage('Category is required'), 
    adminController.postAdd
)

router.get(
    '/orders', 
    adminGuard, 
    adminController.getOrders
)

router.post(
    '/orders/filterByStatus', 
    adminGuard, 
    bodyParser.urlencoded({extended: true}), 
    adminController.getOrdersByStatus
)

router.post(
    '/orders/filterByUser', 
    adminGuard, 
    bodyParser.urlencoded({extended: true}), 
    check('email')
        .not().isEmpty().withMessage('Enter Email!')
        .isEmail().withMessage('Enter Vaild Email.'), 
    adminController.getOrdersByUser
)

router.post(
    '/order/changeStatus', 
    adminGuard, 
    bodyParser.urlencoded({extended: true}), 
    adminController.changeStatus
)


module.exports = router