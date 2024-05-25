const express = require("express");
const app = express();
const user = require('./controller/user.js')
const admin = require('./controller/admin.js');
var auth = require("./service/authorization.js");
var checkRole = require('./service/checkRole.js')

//MIDDLEWARE
app.use(express.json())
app.post("/signup",user.signupUser)
app.post("/login",user.loginUser)
app.patch("/user/:id",auth.authenticateToken,checkRole.checkRole,user.updateUser)
app.delete('/user/:id',auth.authenticateToken,checkRole.checkRole,user.deleteUser)
app.get("/users",auth.authenticateToken,checkRole.checkRole,user.getUser)
app.post("/admin/franchise",auth.authenticateToken,checkRole.checkRole,admin.createFranchise)
app.patch("/admin/franchise/:id",auth.authenticateToken,checkRole.checkRole,admin.updateFranchise)
app.delete("/admin/franchise/:id",auth.authenticateToken,checkRole.checkRole,admin.deleteFranchise)
//PORT
app.listen(8989, () => {
    console.log("Server is running on port 8989")
})