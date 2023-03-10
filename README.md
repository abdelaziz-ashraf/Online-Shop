# Online-Shop

## Build with 
* Node js
* Express js
* MongoDB 
* Mongoose
* bcrypt
* express-session

## Models (Schemas)
**User**
```
{
    username: String, 
    email: String,
    password: String, 
    isAdmin: {
        type: Boolean, 
        default: false
    }
}
```

**Cart**
```
{
    name: String, 
    price: Number, 
    amount: Number, 
    userId: String,
    productId: String, 
    timestamp: Number
}
```

**Order**
```
{
    productName: String, 
    price: Number, 
    amount: Number, 
    userId: String,
    productId: String, 
    timestamp: Number, 
    address: String, 
    status: String
}
```

**Product**
```
{
    name: String, 
    image: String, 
    price: Number, 
    description: String, 
    category: String
}
```

## Routes
**Auth**
```
GET('/signup', authGuard.isNotAuth, authController.getSignup)

POST('/signup', authGuard.isNotAuth, validation, authController.postSignup)

GET('/login', authGuard.isNotAuth, authController.getLogin)

POST('/login', authGuard.isNotAuth, validation, authController.postLogin)

ALL('/logout', authGuard.isAuth, authController.logout)
```

**Home**
```
GET('/', homeController.getHome) 
```

**Admin**
```
GET( '/add',  adminGuard,  adminController.getAdd)

POST('/add', adminGuard,validation,adminController.postAdd)

GET('/orders', adminGuard, adminController.getOrders)

POST('/orders/filterByStatus', adminGuard, adminController.getOrdersByStatus)

POST('/orders/filterByUser', adminGuard, validate('email'),adminController.getOrdersByUser)

POST('/order/changeStatus', adminGuard, adminController.changeStatus)
```

**Cart**
```
GET('/', authGaurd.isAuth, cartController.getCart)

POST('/', authGaurd.isAuth, validate('amount'), cartController.postCart)

POST('/save', authGaurd.isAuth, validate('amount'), cartController.postSave)

DEL( '/delete', authGaurd.isAuth, cartController.postDelete)

DEL( '/deleteAll', authGaurd.isAuth, cartController.postDeleteAll)
```

**Orders**
```
GET('/', authGaurd.isAuth, ordersController.getOrders)

POST('/verifyOrder', authGaurd.isAuth, ordersController.postVerifyOrder)

GET('/verifyOrder', authGaurd.isAuth, ordersController.getVerifyOrder)

GET('/verifyAll', authGaurd.isAuth, ordersController.getVerifyAll)

POST('/addOrder', authGaurd.isAuth, validate('address'), ordersController.addOrder)

POST('/addAllOrders', authGaurd.isAuth, validate('address'), ordersController.addAllOrders)

DEL('/cancelOrder', authGaurd.isAuth, ordersController.cancelOrder)

DEL('/cancelAllOrders', authGaurd.isAuth, ordersController.cancelAllOrders)
```

**Product**
```
GET('/', productController.getProduct)

GET('/:id', productController.getProductById) 
```