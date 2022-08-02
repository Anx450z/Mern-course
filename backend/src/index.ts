import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import passport from 'passport'
import passportLocal from 'passport-local'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bycrypt from 'bcryptjs'
import { User } from './entities/User'
import { UserInterface, DatabaseUserInterface } from './Interface/UserInterface'
import dotenv from 'dotenv'
import { dataSource } from './dataSource'
import { UserController } from './controller/userController'
import { isAdminMiddleware } from './middleware/adminMiddleware'

const LocalStrategy = passportLocal.Strategy

dotenv.config()

const main = async () => {
  try {
    await dataSource.initialize()
    console.log('🟢 Connected successfully to Postgresql 🐘')

    // * Load Routes
    // app.use('/api/user', createUserRouter)

    app.listen(process.env.SERVER, () => {
      console.log('🟢 Server running at configured port 🌐')
    })
  } catch (error) {
    console.log(error)
    throw new Error('🔴 Unable to connect to Postgresql 🤔')
  }
}

// Middleware using Express
const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(
  session({
    secret: 'ankur',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

main()

//Passport
passport.use(
  new LocalStrategy(async (email: string, password: string, done) => {
    try {
      const user = await User.findOneBy({ email: email })

      if (!user) return done(null, false)
      bycrypt.compare(password, user.password, (err:any, result: boolean) => {
        if (err) throw err
        if (result === true) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  })
)

passport.serializeUser((user: any, cb: any) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id: number, cb: any) => {
  let userInformation, err
  try {
    const user = await User.findOneBy({ id: id })
    if (user != null) {
      userInformation = {
        email: user.email,
        userId: user.id,
        isAdmin: user?.is_admin,
      }
    }
  } catch (error) {
    err = error
  }
  cb(err, userInformation)
})

// Routes
app.post('/register', UserController.userRegistration)

// Middleware for route protection


app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('login success')
})

app.get('/user', (req, res) => {
  res.send(req.user)
})

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.send('logout success')
  })
})

// app.post('/delete', isAdminMiddleware, (req, res, next) => {
//   const { id } = req?.body
//   User.findByIdAndDelete(id, (err: Error) => {
//     if (err) {
//       return next(err)
//     }
//     res.send('success')
//   })
// })

// app.get('/users', isAdminMiddleware, (req, res, next) => {
//   User.find({}, (err: Error, data: DatabaseUserInterface[]) => {
//     if (err) {
//       return next(err)
//     }
//     const filteredUser: UserInterface[] = []
//     data.forEach((item: DatabaseUserInterface) => {
//       const userInformation = {
//         id: item._id,
//         username: item.username,
//         isAdmin: item.isAdmin,
//       }
//       filteredUser.push(userInformation)
//     })
//     res.send(filteredUser)
//   })
// })

app.listen(4000, () => {
  console.log('Server started')
})
