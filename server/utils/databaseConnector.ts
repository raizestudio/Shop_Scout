import mongoose from "mongoose";

export const connectToDatabase = async (dbURI: string, dbName?: string, options?: mongoose.ConnectOptions) => {
  mongoose.connect(`${dbURI}/${dbName}`, options)
    .then(() => {
      console.log("MongoDB connected.");
    })
    .catch((err: any) => {
      if (err.reason.error.code === "ENOTFOUND") {
        console.log("Database not found.");
      }

      if (err.reason.error.code === "ECONNREFUSED") {
        console.log("Database connection refused.");
      }
    });
};
