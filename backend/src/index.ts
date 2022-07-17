import mongoose, { Error } from "mongoose";
import express from "express";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bycrypt from "bcryptjs";
import dotnet from "dotenv";

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
