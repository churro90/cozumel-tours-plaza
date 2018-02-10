var mongoose = require("mongoose");

var confirmedReservationSchema = new mongoose.Schema({
        id            : String,
        name          : String,
        email         : String,
        date          : Date,
        startTime     : String,
        arrival       : String,
        hotelOrCruise : String,
        vehicle       : String,
        people        : String,
        country       : String,
        celular       : String,
        info          : String,
        requirements  : String,
        babySeat      : String,
        estado        : String,
        chofer        : String,
        salida        : String,
        horarioFerry  : String
        
});

module.exports = mongoose.model("confirmedReservation", confirmedReservationSchema);