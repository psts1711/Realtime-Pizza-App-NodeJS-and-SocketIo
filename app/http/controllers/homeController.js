const Menu = require('../../models/menu');

function homeController(){
    return{
        async index(req, res){
            const getAllPizzas = await Menu.find()
            res.render('home', {pizzas: getAllPizzas});
        }

        // async index(req, res){
        //     await Menu.find().then(function(getAllPizzas){
        //         res.render('home', {pizzas: getAllPizzas});
        //     });
        // }
    }
}

module.exports = homeController