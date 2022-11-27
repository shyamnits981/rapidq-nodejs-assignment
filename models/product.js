const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    rollnumber:String,
    collagename:String,
    userId:String,
    branch:String,
    duedate:String,
    propitylevel:String,
    starred:String,
    creationdate:String,
    finishdate:String


});


module.exports = mongoose.model("Products",productSchema )