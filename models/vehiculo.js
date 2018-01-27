var mongoose = require("mongoose");

var vehiculoSchema = new mongoose.Schema({
    tipo : String,
    cantidad: Number
        
});

module.exports = mongoose.model("Vehiculo", vehiculoSchema);