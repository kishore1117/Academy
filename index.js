const express = require("express");
const app = express();
const user = require('./controller/user.js')
var auth = require("./service/authorization.js");
var checkRole = require('./service/checkRole.js')

//MIDDLEWARE
app.use(express.json())
app.post("/signup",user.signupUser)
app.post("/login",user.loginUser)
app.patch("/user/:id",auth.authenticateToken,checkRole.checkRole,user.updateUser)
app.get("/users",auth.authenticateToken,checkRole.checkRole,user.getUser)
//PORT
app.listen(8989, () => {
    console.log("Server is running on port 8989")
})