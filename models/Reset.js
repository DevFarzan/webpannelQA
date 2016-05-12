var mongoose = require('mongoose');

var ResetSchema = new mongoose.Schema({
    token: {type: String },
    email:    {type: String },
    createdOn: {type: Date}
});

mongoose.model( 'Reset', ResetSchema);