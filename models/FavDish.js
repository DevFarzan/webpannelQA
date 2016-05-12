var mongoose = require('mongoose');
var config = require('../config/config'); 

var FavDishSchema = new mongoose.Schema({   
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  favdishChef: [{
    chefid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chefname: { type: String  },
    dishes: []  
  }] 

});

mongoose.model('FavDish', FavDishSchema);