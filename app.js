const port = 3000

const express = require('express')
const path = require('path')

const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const homeRouter = require('./routes/home.route')
const productRouter = require('./routes/product.route')
const authRouter = require('./routes/auth.route')
const cartRouter = require('./routes/cart.route')
const ordersRouter = require('./routes/orders.route')
const adminRouter = require('./routes/admin.route')

const app = express()

app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(flash())

const STORE = new sessionStore({
    uri: 'mongodb://127.0.0.1:27017/online_shop', 
    collection: 'sessions'
})

app.use(session({
    secret: 'this is a secret .. do not tell anyone.',
    saveUninitialized: false,
    store: STORE
}))

app.set('view engine', 'ejs')
app.set('views', 'views')

 
app.use('/', authRouter)
app.use('/', homeRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/orders', ordersRouter)
app.use('/admin', adminRouter)

app.get('/error', (req, res, next)=>{
    res.render('error.ejs', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin, 
        pageTitle: 'Error'
    })  
})

app.get('/notAdmin', (req, res, next)=>{
    res.render('notAdmin.ejs', {
        isUser: req.session.isUser, 
        isAdmin: false, 
        pageTitle: 'Not Admin'
    })  
})


app.use((req, res, next) => {
    res.status(404)
    res.render('not-found', {
        isUser: req.session.isUser, 
        isAdmin: req.session.isAdmin, 
        pageTitle: 'Page Not Found'
    })
})

app.listen(port, (err)=>{
    console.log(err)
    console.log(`Server listen on port ${port}`)
})