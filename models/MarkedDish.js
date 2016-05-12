var mongoose = require('mongoose');

var MarkedDishSchema = new mongoose.Schema({
    chefid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dishes: [
    	 
    ]     
});

mongoose.model( 'MarkedDish', MarkedDishSchema);