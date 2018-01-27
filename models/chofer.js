var mongoose = require("mongoose");

var choferSchema = new mongoose.Schema({
    nombre : String,
    apellido : String,
    email : String
        
});

module.exports = mongoose.model("Chofer", choferSchema);