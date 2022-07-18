import mongoose from "mongoose";
import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bycrypt from "bcryptjs";
import dotnet from "dotenv";
import User from "./User";
import {
  UserInterface,
  DatabaseUserInterface,
} from "./Interface/UserInterface";

const LocalStrategy = passportLocal.Strategy;

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

//Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err: any, user: any) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bycrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

passport.serializeUser((user: any, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: any, user: any) => {
    const userInformation = {
      username: user.username,
      isAdmin: user.isAdmin,
    };
    cb(err, userInformation);
  });
});

// Routes
app.post("/register", async (req, res) => {
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
  // Check user already exist else success
  User.findOne({ username }, async (err: Error, doc: DatabaseUserInterface) => {
    if (err) throw err;
    if (doc) res.send("user Already Exists");
    if (!doc) {
      const hashedPassword = await bycrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("success");
    }
  });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("login success");
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("logout success");
  });
});

app.post("/delete", (req, res, next) => {
  const { id } = req.body;
  User.findByIdAndDelete(id, (err: Error) => {
    if (err) {
      return next(err);
    }
    res.send("success");
  });
});

app.get("/users", (req, res, next) => {
  User.find({}, (err: Error, data: DatabaseUserInterface[]) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
});

app.listen(4000, () => {
  console.log("Server started");
});
