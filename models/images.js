var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var imageSchema = new Schema({
  img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model("Images", imageSchema);
