const express = require("express");
const app = express();
const user = require('./controller/user.js')
const admin = require('./controller/admin.js');
var auth = require("./service/authorization.js");
const student =  require('./controller/student.js');
var checkRole = require('./service/checkRole.js')
var cors = require("cors");
const comman = require('./controller/comman.js')

//MIDDLEWARE
app.use(express.json())
app.use(cors());
app.post("/signup",user.signupUser)
app.post("/login",user.loginUser)
app.post('/forgotpassword',user.forgotPassword)
app.patch("/user/:id",auth.authenticateToken,checkRole.checkRole,user.updateUser)
app.delete('/user/:id',auth.authenticateToken,checkRole.checkRole,user.deleteUser)
app.get("/users",auth.authenticateToken,checkRole.checkRole,user.getUser)
app.post("/admin/franchise",auth.authenticateToken,checkRole.checkRole,admin.createFranchise)
app.patch("/admin/franchise/:id",auth.authenticateToken,checkRole.checkRole,admin.updateFranchise)
app.delete("/admin/franchise/:id",auth.authenticateToken,checkRole.checkRole,admin.deleteFranchise)
app.post('/admin/location',auth.authenticateToken,checkRole.checkSuperAdminRole,admin.createLocation)
app.patch('/admin/location/:id',auth.authenticateToken,checkRole.checkSuperAdminRole,admin.updateLocation)
app.delete('/admin/location/:id',auth.authenticateToken,checkRole.checkSuperAdminRole,admin.deleteLocation)
app.post('/student',auth.authenticateToken,checkRole.checkRole,student.createStudent),
app.patch('/student/:id',auth.authenticateToken,checkRole.checkRole,student.updateStudent)
app.delete('/student/:id',auth.authenticateToken,checkRole.checkRole,student.deleteStudent)
app.get('/student',auth.authenticateToken,checkRole.checkRole,student.getStudents)
app.get('/location/students',auth.authenticateToken,checkRole.checkRole,student.getAllStudents)
app.get('/location',auth.authenticateToken,checkRole.checkRole,admin.getLocation)
app.get('/location/:id',auth.authenticateToken,checkRole.checkRole,admin.getLocationById)
app.get('/search',auth.authenticateToken,checkRole.checkRole,comman.search)
app.get('/filter',auth.authenticateToken,checkRole.checkRole,comman.filter)
app.get('/current',auth.authenticateToken,user.currentUser)

//PORT
app.listen(8989, () => {
    console.log("Server is running on port 8989")
})