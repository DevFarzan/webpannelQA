var mongoose = require('mongoose');
var config = require('../config/config'); 

var DishSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dishes: [ {
    isactive: {type: Boolean ,  default: false },
    name: { type: String  },
    type:  { type: String  } ,
    descdish: { type: String  },
    servingtype: { type: String  },
    servingquantity: { type: String  },
    cuisine: { type: String  },
    features: [ { type: String } ] , 
    dishphotos: {
      mainphoto: { type: String },
      secphoto: { type: String },
      thirdphoto: { type: String }
    },
    price: { type: Number },
    discount: {
      status: {type: Boolean ,  default: false },
      discoutamount: { type: String },
      fromdate: { type: String },
      todate: { type: String }
    } ,
    advancebooking: {
        status: {type: Boolean ,  default: false },
        mindish: { type: String },
        orderby: { type: String }
    },
    premake: {
        status: {type: Boolean ,  default: false },
        fromdate: { type: String },
        todate: { type: String },
        aftertime: { type: String },
        orderby: { type: String },
        quantity: { type: String }
    },
    regulardishes: [ { type: String } ],
    regdishstatus: { type: Boolean ,  default: false },
    dishtime: { type: String },
    favorites: { type: Number },
    popular: { type: Boolean },    
    featured: { type: Boolean }
  }]  

});
  
mongoose.model('Dish', DishSchema);