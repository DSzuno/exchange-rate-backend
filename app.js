import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const port = parseInt(process.env.PORT || 3000);
app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
