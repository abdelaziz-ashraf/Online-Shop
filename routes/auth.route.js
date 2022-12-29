const router = require('express').Router()
const bodyParser = require('body-parser')
const { check } = require("express-validator");
 
const authController = require('../controllers/auth.controller')

const authGuard = require('./guards/auth.guard')

router.get('/signup', authGuard.isNotAuth, authController.getSignup)

router.post(
    '/signup', authGuard.isNotAuth,
    bodyParser.urlencoded({extended: true}), 
    check('username')
        .not()
        .isEmpty().withMessage('Username is required'),
    check('email')
        .not()
        .isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid format'),
    check('password')
        .isLength({ min: 6 }).withMessage('Min password length is 6'),
    check('confirmPassword')
        .custom((value, {req}) => {
            if(value === req.body.password) return true
            else throw 'passwords are not equal.'
        })
        .withMessage('passwords are not equal.'),
    authController.postSignup
) 

router.get('/login', authGuard.isNotAuth, authController.getLogin)

router.post(
    '/login', authGuard.isNotAuth,
    bodyParser.urlencoded({extended: true}), 
    check('email')
        .not()
        .isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid format'),
    check('password')
        .not()
        .isEmpty().withMessage('Password is required'),
    authController.postLogin
)

router.all('/logout', authGuard.isAuth, authController.logout)

module.exports = router 