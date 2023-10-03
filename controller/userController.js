const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");


// Create a User ----------------------------------------------

const createUser = expressAsyncHandler(async (req, res) => {
    /**
     * TODO:Get the email from req.body
     */
    const email = req.body.email;
    /**
     * TODO:With the help of email find the user exists or not
     */
    const findUser = await User.findOne({ email: email });
  
    if (!findUser) {
      /**
       * TODO:if user not found user create a new user
       */
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      /**
       * TODO:if user found then thow an error: User already exists
       */
      throw new Error("User Already Exists");
    }
  });

// Login User
const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refresh token
const handleRefreshToken = expressAsyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No refresh token');
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error("No Refresh Token present in db or not matched");
      jwt.verify(refreshToken, process.env.JWT_TOKEN, (err, decoded) => {
        if (err || user.id !== decoded.id) {
          throw new Error("There is something wrong with the refresh token");
        } else{
          const accessToken = generateToken(user.id);
          res.json( 
            {accessToken}
          )
        }
    })
})

// logout a user

const logoutUser = expressAsyncHandler(async(req, res) => {
    const id = req.params.id;

    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
        throw new Error('No refresh token');
    }

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    console.log(`User: ${user}`);
    console.log(`Refresh Token: ${refreshToken}`);
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }

    await User.findByIdAndUpdate(id, {
        refreshToken: "",
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    
    return res.sendStatus(204); // forbidden
})
// Update User

const updateUser = expressAsyncHandler(async(req, res) => {
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

const getSingleUser = expressAsyncHandler(async (req, res) => {

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    // Handle the case when req.params.id is not a valid ObjectId
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const getUser = await User.findById(id);
    if (!getUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ getUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

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
    handleRefreshToken,
    logoutUser
};