require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nodejs.lwggm.mongodb.net/NodeJS_API`
  )
  .then(() => console.log("Connected to mongo"))
  .catch((err) => console.error("Failed to connect to mongo, ", err));

