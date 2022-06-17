const mongoose =require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:  {type: String, require},
    email: {type: String, require, unique: true},
    password: {type: String, require},
    role: {type: String, default: 'customer'},
},{ timestamps: true})

//const Menu = mongoose.model('Menu', menuSchema);
//module.exports = Menu;

// here is singular name but in collection automatically change into plural
// example user => users

module.exports = mongoose.model('user', userSchema);