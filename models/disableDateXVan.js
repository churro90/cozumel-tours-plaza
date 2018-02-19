var mongoose = require("mongoose");

var disableDateXVanSchema = new mongoose.Schema({
      date: String
});

module.exports = mongoose.model("disableDateXVan", disableDateXVanSchema);