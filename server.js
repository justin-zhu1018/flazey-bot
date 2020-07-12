const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const WarCards = require("./models/warCards");

const app = express();

const routes = require("./routes/api");

const PORT = process.env.PORT || 8080;

const MONGODB_URI =
  "mongodb+srv://admin:admin123xd@flazey-bot-db.yjtrf.mongodb.net/flazey-bot-db?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI || "mongodb://localhost/db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

app.use(morgan("tiny"));

//dummy save
// const data = { warcards: "yep warcards!" };
// newWarCards = new WarCards(data);
// newWarCards.save((error) => {
//   if (error) {
//     console.log("error save");
//   } else {
//     console.log("save!");
//   }
// });

app.use("/api", routes);
app.listen(PORT, console.log(`SERVER IS STARTING AT ${PORT}`));
