const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

//Nodemailer
const transporter = require ("../config/nodemailer.js")

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { email, password, name, username, role, confirmation} = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || username === "" || name === "") {
    res.json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      if(confirmation){
        transporter.sendMail({
            from: "KickShop@mail.com",
            to: email,
            subject: "Thank you for signing up",
            text: "Thank you for signing up", 
            html: `<h2>Hi there, ${username}</h2>
            <h4>Thank you for signing up in KickShop.<h4>
            <hr>
            <p>You can now create your own store, and buy or sell products. Good luck 😊.
            <br><img src="https://i.gifer.com/2DV.gif" style="width: 150px; margin-top: 20px">
            <p> Sincerely, <br>your KickShop Team</p>`
        });
    }

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, name, username, role });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, _id, password, name, username, role} = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, username, role, password, _id };

      // Send a json response containing the user object
      res.json({ user: user });
    })
    .catch((err) => res.json(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name, username, role, profileImg} = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, username, role, profileImg};

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.json({ authToken: authToken });
      } else {
        res.json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/verify  -  Used to verify JWT stored on the client
router.post("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);
  req.session.currentUser = req.payload;

  // Send back the token payload object containing the user data
  res.json(req.session.currentUser);
});

router.get("/currentUser", (req, res) => {
  console.log("Current user:", req.session.currentUser);
  res.json(req.session.currentUser);
});

router.get("/logout", (req, res, next) =>{
  if(req.session.currentUser){
    req.session.currentUser = null;
    req.session.destroy();
    res.json({message: "Successfully logged out."})
  } 
});

module.exports = router;
