var mongoose = require('mongoose');


var categorySchema = new  mongoose.Schema({
    
    category:String,
    skill:String,
    Question:Array,
    answer:Array,
    InsertedDate:Array
});
mongoose.model('categoryQuestionAnswer',categorySchema);