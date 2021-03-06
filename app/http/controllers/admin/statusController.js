const Order = require('../../../models/order');


function statusController(){
    return{
        updateStatus(req,res){
            Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data)=>{
                if(err){
                return res.redirect('/admin/orders');    
                }
                // eventEmitter
                const eventEmitter =req.app.get('eventEmitter');
                eventEmitter.emit('orderUpdated', {id:req.body.orderId, status:req.body.status});
                return res.redirect('/admin/orders');
            })
        }
    }
}

module.exports = statusController;