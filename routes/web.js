// customer
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');

// middleware
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

// admin
const adminOrdersController = require('../app/http/controllers/admin/adminOrdersController');
const statusController = require('../app/http/controllers/admin/statusController');


function initRoutes(app){
    app.get('/', homeController().index);
    app.get('/login', guest, authController.login);
    app.post('/login', authController.loginDo);


    app.get('/register', guest, authController.register);
    app.post('/register', authController.registerDo);

    app.post('/logout', authController.logoutDo);

    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);

    // customer routes
    app.get('/customers/orders', auth,  orderController().index)
    app.post('/orders',auth, orderController().store)
    app.get('/customers/orders/:id', auth,  orderController().ordersDetails)


    // admin routes
    app.get('/admin/orders', admin,  adminOrdersController().index);
    app.post('/admin/orders/status', admin,  statusController().updateStatus);




    /* app.get('/', (req, res)=>{
        //res.render('folder_name/home');
        res.render('home');
        res.render('customers/cart');
    }); */

    // if you are using
    // exports.authController = authController
    // then you should be use authController.authController.login
}

module.exports = (initRoutes)