const express = require('express');
const {createUser, loginUser, getallUsers, getSingleUser, deleteUser, updateUser, handleRefreshToken} = require('../controller/userController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all-users", getallUsers);
router.get("/:id", getSingleUser);
router.get('/refresh_token', handleRefreshToken);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);

module.exports=router;