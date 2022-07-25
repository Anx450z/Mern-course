# Introduction
 The aim of this project is to demo working login system using MERN stack

 ## Source

 Source of the Project :<a href="https://www.youtube.com/watch?v=Gwru3BueuiE"> `https://www.youtube.com/watch?v=Gwru3BueuiE`</a>

 ---

 ## Commands
 * yarn start
### Backend

* npm init -y
* npm install --global yarn
* yarn add bcryptjs cookie-parser cors dotenv express express-session mongoose passport passport-local
* yarn add @types/bcryptjs @types/cookie-parser @types/cors @types/express @types/mongoose @types/passport @types/passport-local @types/express-session -D
* yarn add nodemon ts-node typescript -D

### Client

* npx create-react-app --template typescript client
* yarn add axios react-router-dom
* yarn add @types/react-router-dom -D

---

## Some exceptions 

* at 12:32 in video

  useCreateIndex: true,
  <br>
  useNewUrlParser: true,
  <br>
  useUnifiedTopology: true

  `these are deprecated`

* use these instead
  autoIndex: true

  `remove others`

* Source : `https://www.mongodb.com/community/forums/t/option-usecreateindex-is-not-supported/123048`

## Misc Fixes

* Sometimes IP address changes and we can;t connect to mongoose DB, in that case we need to add new IP address in Network Access in Mongoose.
