const express = require('express');
const { createUser, 
    loginUser, 
    getallUsers, 
    getSingleUser, 
    deleteUser, 
    updateUser, 
    handleRefreshToken,
} = require('../controller/userController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post("/register", createUser);
router.post("/login", authMiddleware, loginUser);
router.get("/all-users", getallUsers);
router.get("/:id", authMiddleware, getSingleUser);
router.get('/refresh_token/:id', handleRefreshToken);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);

module.exports=router;