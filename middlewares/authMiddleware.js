const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');

const authMiddleware = expressAsyncHandler(async(req, res, next) => {
    let token;
    if (req.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_TOKEN);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();

            }
        } catch (error) {
            throw new Error("Not Authorized");
        }
    } else{
        throw new Error("There is no token attached to the header");
    }
});

module.exports = { authMiddleware };