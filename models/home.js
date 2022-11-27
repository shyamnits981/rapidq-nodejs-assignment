const mongoose = require('mongoose');
const detailsSchema = new mongoose.Schema({
    student:{
        type: String,
        required:true
    },
    collage:{
        type:String,
        required: true
    },
    rollnumber:{
        type:String,
        required:true
    }
})

mongoose.model("details",detailsSchema);