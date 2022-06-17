const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerID: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user',
                require
              },
  items:{type:Object, require:true},
  phone:{type: String, require},
  address:{type: String, require},
  paymentType: {type: String, default: 'cod'},
  status: {type: String, default: 'order_placed'},
},{ timestamps: true})

//const Menu = mongoose.model('Menu', menuSchema);
//module.exports = Menu;

// here is singular name but in collection automatically change into plural
// example order => orders

module.exports = mongoose.model('order', orderSchema);