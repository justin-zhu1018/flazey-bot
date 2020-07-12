const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;
const WarCardSchema = new Schema({
  date: { type: String, default: Date.now() },
  warcards: String,
});
// const WarCardSchema = new Schema({ title: String, body: String });

//Data model
const WarCards = mongoose.model("WarCards", WarCardSchema);

module.exports = WarCards;