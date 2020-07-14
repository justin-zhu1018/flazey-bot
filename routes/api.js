const express = require("express");
const router = express.Router();
const WarCards = require("../models/warCards");

router.get("/", (req, res) => {
  WarCards.find({})
    .then((data) => {
      //   console.log("data");
      res.json(data);
    })
    .catch((error) => {
      console.log("error");
    });
});

router.post("/save", (req, res) => {
  // console.log("request body: ", res);
  const data = req.body;
  console.log("req.body: ", req.body);
  const newTestData = new WarCards(data);
  newTestData.save((error) => {
    if (error) {
      res.status(500).json({ msg: "an error has occurred" });
    } else {
      res.status(200).json({ msg: "data has been saved!" });
    }
  });
});

module.exports = router;
