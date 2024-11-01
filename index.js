const express = require("express");
const port = 8523;
const app = express();
const dotenv = require("dotenv").config();

const bodyParser = require("body-parser");
const eventsRepo = require("./repositories/test");

app.use(bodyParser.json());

app.post('/test', eventsRepo.testInput);

app.listen(port, () => {
  console.log("Server is running and listening on port", port);
});
