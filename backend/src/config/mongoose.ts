import mongoose from "mongoose";

const initDB = async () => {
  mongoose
    .connect(process.env.USER_MONGO_STRING!)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
    });
};

export default initDB;
