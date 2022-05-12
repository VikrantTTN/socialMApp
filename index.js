const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const routesUser = require("./routes/users");
const routesAuth = require("./routes/auth");

const app = express();
dotenv.config();


mongoose.connect('mongodb://localhost:27017/socialMApp',{ useNewUrlParser: true,useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'+err));

app.use(express.json());

app.use("/api/users", routesUser);
app.use("/api/auth", routesAuth);

app.get("/", (req, res) => {
  res.send("Welcome to The Social Media App");
});

app.listen(3000, () => {
  console.log("App Started on Port 3000");
});
