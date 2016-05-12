var mongoose = require('mongoose');

var MarkedChefSchema = new mongoose.Schema({
    chefid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profileid: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    name: { type: String },
    img: { type: String },
    dishes : { type : Number },
    endorsed: { type: Boolean   },
  	featuredchef : { type: Boolean   },
  	verifiedchef: { type: Boolean   }
});

mongoose.model( 'MarkedChef', MarkedChefSchema);