const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL;
const corsOption = {
    origin: frontend_url,
};

const app = express();
app.use(cors(corsOption));

const stores = require("./stores");

app.get("/api/stores", (req, res) => {
  res.json(stores);
});

app.get("/",(req,res) =>{
    res.send("<hi>WElcome Store Delivery Zone Checker  to </hi>");
})

app.listen(PORT,() =>{
    console.log("Server running on port" + PORT)
});
