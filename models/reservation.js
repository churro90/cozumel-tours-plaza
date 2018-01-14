var mongoose = require("mongoose");

var reservationSchema = new mongoose.Schema({
        firstName     : String,
        lastName      : String,
        email         : String,
        date          : Date,
        startTime     : String,
        arrival       : String,
        hotelOrCruise : String,
        vehicle       : String,
        people        : String,
        country       : String,
        areaCode      : String,
        cellphone     : String,
        info          : String,
        requirements  : String,
        babySeat      : String
        
});

module.exports = mongoose.model("Reservation", reservationSchema);