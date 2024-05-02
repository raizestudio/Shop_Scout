import mongoose from "mongoose";

const { Schema } = mongoose;

const currencySchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
});

const Currency = mongoose.model("Currency", currencySchema);
export { Currency };