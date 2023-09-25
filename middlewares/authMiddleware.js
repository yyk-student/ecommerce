const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');

const authMiddleware = expressAsyncHandler(async(req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                next();
            } catch (error) {
                console.error(error);
                res.status(401);
                throw new Error('Not authorized, token failed');
            }
        }
        if (!token) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }
    } catch (error) {
        throw new Error(error);
    }
})