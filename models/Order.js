var mongoose = require('mongoose');
var config = require('../config/config'); 
 
var OrderSchema = new mongoose.Schema({
  orderno: {type: Number}, 
  foodiename: {type: String}, 
  foodie: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String , default : "Unpaid"  },
  orderedon: { type: String  },
  completedon: { type: String  },  
  dishes: [{
    purchfromchef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chefname: { type: String  },
    dishid: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
    name: { type: String  },
    type:  { type: String  } ,
    descdish: { type: String  },
    servingtype: { type: String  },
    servingquantity: { type: String  },
    cuisine: { type: String  },
    features: { type: String } , 
    dishphotos: { type: String },
    price: { type: Number },    
    discount: { type: String },     
    pickuptime: { type: String },
    deliverytime: { type: String }    
  }],
  paymentmethod: { type: String  },
  totalprice: {type: Number},
  deliverycharges: { type: String  },
  action: { type: String  },
  pickupdetails: { type: String  },
  deliveryaddress: {  
    address : { type: String  },
    zone : { type: String  },
    landmark : { type: String  },    
    city : { type: String  },
    province : { type: String  },
    zip : { type: String  },
    country : { type: String  }
  },
  alteraddress: { 
    address : { type: String  },
    zone : { type: String  },
    landmark : { type: String  },
    email : { type: String  },
    mobile : { type: String  },
    othercontact : { type: String  }
  }

});
 
mongoose.model('Order', OrderSchema);