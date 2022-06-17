const Order = require('../../../models/order');
const moment = require('moment')


function orderController(){
    return {
        store(req,res){

           // request validating
           const {myphone, myaddress} = req.body;
           if(!myphone || !myaddress){
                req.flash('error','All fields are required!');       
                return res.redirect('/cart');
           }

           const order = new Order({
            customerID: req.user._id,
            items: req.session.cart.items,
            phone: myphone,
            address: myaddress,
           })
            order.save().then(result=>{
            Order.populate(result,{path: 'customerID'}, (err, placedOrder)=>{

                req.flash('success','Order placed successfully');  

                // Emit Event 
                const eventEmitter =req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced',placedOrder); 
 
                delete req.session.cart ;  
                return res.redirect('/customers/orders');

            })
           }).catch(err=>{
                req.flash('error','Something went wrong! Please try again later.');       
                return res.redirect('/cart');
           })
        },
        async index(req,res){
            //const orders = await Order.find({customerID: req.user._id})
            //res.render('customers/orders', {orders: orders,  moment: moment});

            const orders = await Order.find({ customerID: req.user._id},
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async ordersDetails(req, res){
            const order = await Order.findById(req.params.id);
            // Check user if authorized
            if(req.user._id.toString() === order.customerID.toString()){
                return res.render('customers/orderdetails', {order})
            }else{
                return res.redirect('/');
            }
        }
    }
}

module.exports = orderController;