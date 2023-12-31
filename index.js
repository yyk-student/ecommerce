const express = require("express");
const asyncHandler = require("express-async-handler")
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');

const { notFound, errorHandler } = require("./middlewares/errorHandler");


dbConnect();
// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());

app.use("/api/user", authRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Server is running at PORT ${PORT}`);
})