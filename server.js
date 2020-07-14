const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
var config, MONGODB_URI;
// const WarCards = require("./models/warCards");

if (process.env.NODE_ENV === "production") {
  MONGODB_URI = process.env.MONGODB_URI;
} else {
  try {
    config = require("./config.json");
    MONGODB_URI = config.MONGODB_URI;
  } catch (error) {
    console.log(
      "Currently in development! Remember to turn worker back on in Heroku!"
    );
  }
}
const app = express();

const routes = require("./routes/api");

const PORT = process.env.PORT || 8080;

mongoose.connect(MONGODB_URI || "mongodb://localhost/db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

app.use(morgan("tiny"));

//IMPORTANT for data save
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
