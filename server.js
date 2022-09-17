require("dotenv").config();
const express = require("express");
const cros = require('cros');
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const app = express();
app.use(cros());
app.use(express.json());
app.use(morgan("dev"))

mongoose
    .connect(
        "mongodb+srv://admin:admin@cluster0.yaicuku.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(async () => {
        console.log("Connected to MongoDB...");
    })
    .catch((err) => console.log("Could not connect to MongoDB...", err));



app.use(authentication);




app.listen(process.env.PORT || 8000);



function authentication(req, res, next) {
    const authHeaderInfo = req.headers.authentication;
    if (!authHeaderInfo) {
        res.status(401).json({ msg: "No Token Provided" })
    }
    const token = authHeaderInfo.split(' ').[1];
    console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.Access_Token_Secret)
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        res.send(401).send("Invalid token Provided")
    }









}