const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

// Create User
const createUser = expressAsyncHandler(async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email});
    if (!findUser) {
        // Create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);

    }
    else {
        throw new Error('User already Exists');
    }
})

// Login User
const loginUser = expressAsyncHandler(async(req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    // check if user exists
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, { 
            refreshToken: refreshToken 
        }, { 
            new: true 
        }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000, // 7 days
        }); 

        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else{
        throw new Error("Invalid Credential");
    }
})

// handle refresh token
const handleRefreshToken = expressAsyncHandler(async(req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
})

// Update User

const updateUser = expressAsyncHandler(async(req, res) => {
    validateMongoDbId(req.params.id);
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true
        }
        );
        res.json({
            updateUser
        });

    } catch (error) {
        throw new Error(error); 
    }
        
    }
)
// Get all Users
const getallUsers = expressAsyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
        
    } catch (error) {
        throw new Error(error); 
    }
})

// Get single User

const getSingleUser = expressAsyncHandler(async(req, res) => {

    try {
        const getUser = await User.findById(req.params.id);
        res.json({
            getUser
        });
        
    } catch (error) {
        throw new Error(error); 
    }
})

// Delete single User

const deleteUser = expressAsyncHandler(async(req, res) => {

    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.json({
            deleteUser
        });
        
    } catch (error) {
        throw new Error(error); 
    }
})

module.exports={
    createUser, 
    loginUser,
    getallUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    handleRefreshToken
};