import mongoose from "mongoose";

const { Schema } = mongoose;

const countrySchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  currency: { type: String, required: true},
});

const Country = mongoose.model("Country", countrySchema);

export { Country };
