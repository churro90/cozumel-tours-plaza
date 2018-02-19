var mongoose = require("mongoose");

var disableDateCarSchema = new mongoose.Schema({
      date: String
});

module.exports = mongoose.model("disableDateCar", disableDateCarSchema);