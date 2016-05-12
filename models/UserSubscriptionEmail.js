var mongoose = require('mongoose');

var userEmailSchema = new mongoose.Schema({
   userEmail:String,
   InsertedDate:Array
});

mongoose.model('userSubscribe',userEmailSchema);