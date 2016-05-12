var mongoose = require('mongoose');
var config = require('../config/config'); 

var ProfileSchema = new mongoose.Schema({
  usertype: { type: String  },
  regisId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  secmobile: String,
  aboutdetails: { type: String  },
  businessname: { type: String  },
  city : { type: String  },
  region : { type: String  },
  address : { type: String  },
  nearlandmark : { type: String  },
  altername : { type: String  },
  altermobile : { type: String  },
  cuisines : [ { type: String } ] ,
  speciality : { type: String  },
  foodstory : { type: String  },
  img: { type: String, default: config.defaultChefImgURL },
  imgpublicid: { type: String  },
  profiledate: { type: String },
  followers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ] ,
  favdishes: [ { type: String   } ],
  endorsed: { type: Boolean   },
  featuredchef : { type: Boolean   },
  verifiedchef: { type: Boolean   }

});
 
mongoose.model('Profile', ProfileSchema);