var mongoose = require("mongoose");

var disableDateLargerVanSchema = new mongoose.Schema({
      date: String
});

module.exports = mongoose.model("disableDateLargerVan", disableDateLargerVanSchema);