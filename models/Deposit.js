const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
  blockNumber: String, // Assuming blockNumber is stored as a string
  blockTimestamp: Date, // Timestamp of the block
  fee: Number, // Fee associated with the deposit
  hash: String, // Transaction hash
  pubkey: String, // Public key (or address) related to the transaction
});

module.exports = mongoose.model("Deposit", depositSchema);
