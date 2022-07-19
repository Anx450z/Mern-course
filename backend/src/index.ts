import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bycrypt from "bcryptjs";
import User from "./User";
import {
  UserInterface,
  DatabaseUserInterface,
} from "./Interface/UserInterface";
import dotenv from "dotenv";

const LocalStrategy = passportLocal.Strategy;

dotenv.config();
mongoose.connect(
  `${process.env.PART1}${process.env.USERNAME}:${process.env.PASSWORD}${process.env.PART2}`,
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

// Middleware using Express
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
  new LocalStrategy((username : string, password : string, done) => {
    User.findOne({ username: username }, (err : any, user: DatabaseUserInterface) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bycrypt.compare(password, user.password, (err, result : boolean) => {
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

passport.serializeUser((user: DatabaseUserInterface, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: any, user: DatabaseUserInterface) => {
    const userInformation : UserInterface= {
      username: user.username,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

// Routes
app.post("/register", async (req : Request, res : Response) => {
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

// Middleware for route protection
function isAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  const { user }: any = req;
  if (user) {
    User.findOne(
      { username: user.username },
      (err: Error, doc: DatabaseUserInterface) => {
        if (err) {
          return next(err);
        }
        if (doc?.isAdmin) {
          next();
        } else {
          res.send("You don't have right access privileges.");
        }
      }
    );
  } else {
    res.send("You must login.");
  }
}

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

app.post("/delete", isAdminMiddleware, (req, res, next) => {
  const { id } = req.body;
  User.findByIdAndDelete(id, (err: Error) => {
    if (err) {
      return next(err);
    }
    res.send("success");
  });
});

app.get("/users", isAdminMiddleware, (req, res, next) => {
  User.find({}, (err: Error, data: DatabaseUserInterface[]) => {
    if (err) {
      return next(err);
    }
    const filteredUser: UserInterface[] = [];
    data.forEach((item : DatabaseUserInterface) => {
      const userInformation = {
        id: item._id,
        username: item.username,
        isAdmin: item.isAdmin,
      };
      filteredUser.push(userInformation);
    });
    res.send(filteredUser);
  });
});

app.listen(4000, () => {
  console.log("Server started");
});
