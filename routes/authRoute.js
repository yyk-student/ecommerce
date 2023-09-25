const express = require('express');
const {createUser, loginUser, getallUsers, getSingleUser, deleteUser, updateUser} = require('../controller/userController');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getallUsers);
router.get("/:id", getSingleUser);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);

module.exports=router;