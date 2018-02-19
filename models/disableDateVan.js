var mongoose = require("mongoose");

var disableDateVanSchema = new mongoose.Schema({
      date: String
});

module.exports = mongoose.model("disableDateVan", disableDateVanSchema);