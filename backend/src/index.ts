import mongoose, { Error } from "mongoose";
import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bycrypt from "bcryptjs";
import dotnet from "dotenv";
import User from "./User";

mongoose.connect(
  "mongodb+srv://ankur:ankur@cluster0.pwl0a.mongodb.net/?retryWrites=true&w=majority",
  {
    // useCreateIndex: true, // not working
    autoIndex: true,
    // useNewUrlParser: true, // not working
    // useUnifiedTopology: true, // not working
  },
  (err: Error) => {
    if (err) throw err;
    console.log("Connected to DB");
  }
);

// Middleware
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: "ankur",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post("/register", async (req: Request, res: Response) => {
  // username, password validation
  const { username, password } = req?.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.send("Improper Values");
    return;
  }
  // Check user already exist
  User.findOne({ username }, async (err: Error, doc: Document) => {
    if (err) throw err;
    if (doc) res.send("user Already Exists");
    if (!doc) {
      const hashedPassword = await bycrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("Success");
    }
  });
});

app.listen(4000, () => {
  console.log("Server started");
});
