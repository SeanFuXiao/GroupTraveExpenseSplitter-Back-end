const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },
  payer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model("Bill", BillSchema);