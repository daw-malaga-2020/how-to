const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = new Schema( {
	title: {type: String, required: true},
	user: {type: String, required: true},
})

module.exports = orderSchema