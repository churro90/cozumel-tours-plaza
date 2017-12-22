var mongoose = require("mongoose");

var countrySchema = new mongoose.Schema({
    name: String,
    dialCode: String,
    code: String
})

module.exports = mongoose.model("Country", countrySchema);