var mongoose = require ('mongoose');
//var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var categorySkillSchema = new  mongoose.Schema({

    category:String,
    skill:{ type: String, required: true, unique: true }
    
});
categorySkillSchema.plugin(uniqueValidator);
mongoose.model('categorySkill',categorySkillSchema);