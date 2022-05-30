const express = require("express");
const UserController = require("./controllers/users")
const productsController = require("./controllers/products");
const cors = require("cors");
const bodyParser = require('body-parser');
require("./db/conn");
const User = require("./models/users");
var corsOptions = {
  origin:"http://localhost:4200"
};
const app = express();
app.use( express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT || 3001;
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  res.send("Welcome ! You're On the Home ");
})

// user api
app.post("/DuplicateUser",UserController.DuplicateUser)

app.post("/usersAdd", UserController.upload ,UserController.usersAdd)

app.post("/LoginUser", UserController.LoginUser)

app.get("/getUsers", UserController.getUsers)

app.post("/deleteUser", UserController.deleteUser)

app.post("/changeStatus", UserController.changeStatus)

app.post("/getUserData", UserController.getUserData)

app.post("/updateUserData", UserController.updateUserData)

app.post("/updateUserWithPhoto",UserController.upload,UserController.updateUserWithPhoto)

//  products api

app.post("/addProductApi",productsController.upload,productsController.addProductApi)

app.get("/getProductApi",productsController.getProductApi)

app.post("/getProductDetails",productsController.getProductDetails)

app.post("/updateProDetails",productsController.upload,productsController.updateProDetails)

app.post("/deleteProduct", productsController.deleteProduct )



app.listen(port, () => {
  console.log(`connection is setup on port no ${port}`);
})