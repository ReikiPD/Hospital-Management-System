const express = require("express");
const port = 8523;
const app = express();
const dotenv = require("dotenv").config();

const bodyParser = require("body-parser");
const eventsRepo = require("./repositories/test");
const adminController = require("./controller/admin"); 

app.use(bodyParser.json());

app.post('/test', eventsRepo.testInput);
app.post('/admin', adminController.createAdmin);
app.get('/admin/:admin_id', adminController.getAdminById);
app.get('/admin', adminController.getAllAdmin);
app.put('/admin/:admin_id', adminController.updateAdminById);
app.delete('/admin/:admin_id', adminController.deleteAdminById);

app.listen(port, () => {
  console.log("Server is running and listening on port", port);
});
