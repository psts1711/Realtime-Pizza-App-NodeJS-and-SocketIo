const mongoose =require('mongoose');

const Schema = mongoose.Schema;
const menuSchema = new Schema({
    name:  {type: String, require},
    image: {type: String, require},
    price: {type: Number, require},
    size:  {type: String, require},
})

//const Menu = mongoose.model('Menu', menuSchema);
//module.exports = Menu;


// here is singular name but in collection automatically change into plural
// example menu => menus
module.exports = mongoose.model('menu', menuSchema);