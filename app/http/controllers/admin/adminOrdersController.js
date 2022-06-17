const Order = require('../../../models/order');


function adminOrdersController(){
    return{
        index(req,res){
            Order.find({status:{$ne:'completed'}}, null, {sort:{'createdAt':-1}}).populate('customerID', '-password').exec((err, orders)=>{
              //  res.render('admin/orders', { orders: orders, moment: moment })
              if(req.xhr){
                 return res.json(orders)
              }else{
                return res.render('admin/orders')
              }
            })
        },
        
    }
}

module.exports = adminOrdersController;