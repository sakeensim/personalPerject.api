#Server

## Step 1 create packagejson file
```bash
npm init - y
```

## Step 2 instal package...
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma 
```

## Step 3
```bash
npx prisma init
```

## Step 4 Git
```bash
git init
git add .
git commit -m "message"
```

next step
copy code from repo
only first time
(get them from github 3 line from buttom)
```bash
git remote add origin https://github.com/sakeensim/PP-api
git branch -M main
git push -u origin main
```
when update code

git add . 
git commit -m "message"
git push

## Step 5 start server
```bash
const express =require('express')
const app = express()



// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on pport ${PORT}`));
```

## Step 5 Middleware
```bash
const express =require('express')
const cors =  require('cors')
const morgan = require('morgan')
const app = express()

//middleware
app.use(cors()); // Allow cross domain
app.use(morgan('dev')); // show log terminal
app.use(express.json()); // For read json



// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on pport ${PORT}`));
```

## Step6 Routing  & Controller [Register, Login]
create folder Routes and file auth-routes.js
```bash
const express = require("express");
const router = express.Router()
const authControllers = require("../controllers/auth-contoller")


// @ENDPOINT http://localhost: 8000/api/register
router.post("/register",authControllers.register);
router.post("/login",authControllers.login);


//export
module.exports = router;
```
in index.js
```bash
const authRouter = require("./Routes/auth-routes")

//Routing
app.use("/api", authRouter)

```

folder controllers and file auth-controller.js
```bash

exports.register = (req,res,next) =>{
    //code   
    try{
       res.json({message  : "hello register"})
    }catch(error){
       res.status(err.stautusCode || 500).json({message: err.message || "Something went wrong!!"})
    }
   };

exports.login = (req,res,next) =>{
    try {
        console.log(ssss)
        res.json({message: "hello login"})
    } catch (error) {
        res.status(err.stautusCode || 500).json({message: err.message || "Something went wrong!!"})
    }
   }
```


 
 ## Step 7 Create handle Error
 create folder middleware, create error.js file(write code below in this file)
 ```bash
 const handleErrors = (err,req,res,next)=>{
    res
    .status(err.stautusCode || 500)
    .json({message: err.message || "Something went wrong!!"})
}

module.exports = handleErrors;
```
in index.js
```bash
const handleErrors = require("./middlewares/error") //import

//Error
app.use(handleErrors) // use
```

in auth-controller.js
```bash

exports.register = (req,res,next) =>{
    //code   
    try{
       res.json({message  : "hello register"})
    }catch(error){
       next(error)
    }
   };

exports.login = (req,res,next) =>{
    try {
        console.log(ssss)
        res.json({message: "hello login"})
    } catch (error) {
        next(error)
    }
   }
```
## step 8 Create Error 
create folder utils and file createError.js
```bash
const createError = (code, message) =>{
    console.log("step 1 Create error")
    const error = new Error(message)
     error.statusCode = code;
     throw error;
};

module.exports = createError
```
## step 9 validate in auth-controller
/middleware/validators.js
```bash

const { z } = require("zod")

//test validation
 exports.registerSchema = z.object({
    email: z.string().email("email ไม่ถูกต้อง"),
    firstname: z.string().min(3, "Firstname ต้องมากกว่า 3 อักขระ"),
    lastname: z.string().min(3, "lastname ไม่ถูกต้องต้องอย่างน้อย 3 อักขระ"),
    password: z.string().max(8, "Password ต้องไม่มากกว่า 8 ตัว"),
    confirmpassword: z.string().max(8, "confirmpassword ต้องไม่มากกว่า 8 ตัว")
}).refine((data) => data.password === data.confirmpassword, {
    message: "Confirm password ไม่ต้องกัน",
    path: ["confirmassword"]
})

exports.loginSchema = z.object({
    email: z.string().email("email ไม่ถูกต้อง"),
    password: z.string().max(8, "Password ต้องไม่มากกว่า 8 ตัว")
})
exports.validateWithZod = (schema) => (req, res, next) => {
    try {
        console.log("Hello midlleWare")
        schema.parse(req.body)
        next()

    } catch (error) {
        const errMsg = error.errors.map((el) => el.message)
        const errTxt = errMsg.join(",")
        const mergeError = new Error(errTxt)
        next(mergeError)
    }
}
```
and update code 
/routes/auth-routes.js
```bash
const express = require("express");
const router = express.Router()
const authControllers = require("../controllers/auth-contoller");
const { validateWithZod, registerSchema, loginSchema } = require("../middlewares/validators");


// @ENDPOINT http://localhost: 8000/api/register
router.post("/register", validateWithZod(registerSchema), authControllers.register);
router.post("/login",validateWithZod(loginSchema),authControllers.login);



//export
module.exports = router;
```
## step 10 Prisma
```bash
npx prisma db push
```
# or

```bash
npx prisma migrate dev --name init
```

### config prisma
configs/prisma.js
```bash
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
```


update code
Register
/controllers/auth-controller.js
```bash

const prisma = require("../configs/prisma");
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")


exports.register = async (req,res,next) =>{
    //code   
    try{
    //step 1 req.body
    const {email, firstname,lastname,password, confirmpassword} = req.body

    //step 2 validate

    //---------
    // if(!email){
    //     return createError(400, "email is require")
    // }
    // if(!firstname){
    //     return createError(400, "firstname is require")
    // }
    ///-------


    //step 3 Check already
    const checkEmail = await prisma.profile.findFirst({
        where: {
            email: email,
        }
    })
    console.log(checkEmail)
    if(checkEmail){
        return createError(400,"Email is alreadr exits!!!")
    }
    //step 4 Encrypt bcrypt
    // const salt =bcrypt.genSaltSync(10)
    // const hashedPassword = bcrypt.hashSync(password,salt)
    const hashedPassword = bcrypt.hashSync(password,10)
    // console.log(salt)
    // console.log(hashedPassword)

    //step 5 Inser to DB
    const profile = await prisma.profile.create({
        data: {
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
        }
    })

    //step 6 Response

       res.json({message  : "Register Success"})
    }catch(error){
        console.log("step 2 Catch")
       next(error)
    }
   };

exports.login = (req,res,next) =>{
    try {
        res.json({message: "hello login"})
    } catch (error) {
        next(error)
    }
   }
```
## step 10 login
/controllers/auth-controller.js
```bash

const prisma = require("../configs/prisma");
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


exports.register = async (req,res,next) =>{
    //code   
    try{
    //step 1 req.body
    const {email, firstname,lastname,password, confirmpassword} = req.body

    //step 2 validate

    //---------
    // if(!email){
    //     return createError(400, "email is require")
    // }
    // if(!firstname){
    //     return createError(400, "firstname is require")
    // }
    ///-------


    //step 3 Check already
    const checkEmail = await prisma.profile.findFirst({
        where: {
            email: email,
        }
    })
    console.log(checkEmail)
    if(checkEmail){
        return createError(400,"Email is alreadr exits!!!")
    }
    //step 4 Encrypt bcrypt
    // const salt =bcrypt.genSaltSync(10)
    // const hashedPassword = bcrypt.hashSync(password,salt)
    const hashedPassword = bcrypt.hashSync(password,10)
    // console.log(salt)
    // console.log(hashedPassword)

    //step 5 Inser to DB
    const profile = await prisma.profile.create({
        data: {
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
        }
    })

    //step 6 Responsenpm start

       res.json({message  : "Register Success"})
    }catch(error){
        console.log("step 2 Catch")
       next(error)
    }
   };

exports.login = async (req,res,next) =>{
    try {
        //step 1 req.body
        const{email, password} = req.body
        
        //step 2 Check email and password
        const profile = await prisma.profile.findFirst({
            where:{
                email: email
            }
        })
        if(!profile){
            return createError(400, "Email, Password is invalid")
        }

        const isMatch= bcrypt.compareSync( password, profile.password)

        if(!isMatch){
            return createError(400,"Your Password is WRONG !!!!!!!")
        }
        //step 3 Generate token
        const payload = {
            id: profile.id,
            email: profile.email,
            firstname: profile.firstname,
            role: profile.role,
        }
        const token = jwt.sign(payload,process.env.SECRET,{
            expiresIn: "1d"
        })
        console.log(token)
        //step 4 response
        res.json({
            message: "Login Sucess, Welcome Bro!!",
            payload: payload,
            token: token,
        })
    } catch (error) {
        next(error)
    }
   }
```










```plaintext
text
```

|METHOD|ENDPOINT|BODY|
|-----|-----|-----|
|POST|/api/register|email,password|

## validate prosess doing
```bash
```
in file auth-routes.js
```bash
const{ z } = require("zod")

///test validation
const registerSchema = z.object({
    email: z.string().email("email ไม่ถูกต้อง"),
    firstname: z.string().min(3,"Firstname ต้องมากกว่า 3 อักขระ"),
    lastname: z.string().min(3,"lastname ไม่ถูกต้องต้องอย่างน้อย 3 อักขระ"),
    password: z.string().max(8, "Password ต้องมากกว่า 8 ตัว")
})

const validateWithZod = (schema)=>(req,res,next)=>{
try {
    console.log("Hello midlleWare")
    schema.parse(req.body)
    next()
    
} catch (error) {
    console.log(error.errors)
    next(error)    
}
}
// @ENDPOINT http://localhost: 8000/api/register
router.post("/register",validateWithZod(),authControllers.register);
router.post("/login",authControllers.login);



//final error
const registerSchema = z.object({
    email: z.string().email("email ไม่ถูกต้อง"),
    firstname: z.string().min(3, "Firstname ต้องมากกว่า 3 อักขระ"),
    lastname: z.string().min(3, "lastname ไม่ถูกต้องต้องอย่างน้อย 3 อักขระ"),
    password: z.string().max(8, "Password ต้องไม่มากกว่า 8 ตัว"),
    confirmpassword: z.string().max(8, "confirmpassword ต้องไม่มากกว่า 8 ตัว")
}).refine((data) => data.password === data.confirmpassword, {
    message: "Confirm password ไม่ต้องกัน",
    path: ["confirmassword"]
})

const validateWithZod = (schema) => (req, res, next) => {
    try {
        console.log("Hello midlleWare")
        schema.parse(req.body)
        next()

    } catch (error) {
        const errMsg = error.errors.map((el) => el.message)
        const errTxt = errMsg.join(",")
        const mergeError = new Error(errTxt)
        next(mergeError)
    }
}
```

## step 11 current- user
/controller/auth-controller.js
```bash
exports.currentUser = async(req,res,next)=>{
    try {
        res.json({message: "Hello,current user"})
    } catch (error) {
        next(error)
    }
}
```
update code in 
/routes/user-controller.js
```bash
const express = require("express")
const router = express.Router()
//import controller

const userController = require('../controllers/user-controller')

//@ENDPOINT http://localhost:/8000/api/users
router.get('/users', userController.listUsers)
router.patch('/user/update-role', userController.updateRole)
router.delete('/user/:id',userController.deleteUser)



module.exports = router;
```
update code in 
/routes/user-routes.js
```bash
const express = require("express")
const router = express.Router()
//import controller

const userController = require('../controllers/user-controller')

//@ENDPOINT http://localhost:/8000/api/users
router.get('/users', userController.listUsers)
router.patch('/user/update-role', userController.updateRole)
router.delete('/user/:id',userController.deleteUser)



module.exports = router;
```

update index.js
```bash
const express =require('express')
const cors =  require('cors')
const morgan = require('morgan')
const handleErrors = require("./middlewares/error")

//Routing
const authRouter = require("./Routes/auth-routes")
const userRouter = require("./Routes/user-routes")

const app = express()


//middleware
app.use(cors()); // Allow cross domain
app.use(morgan('dev')); // show log terminal
app.use(express.json()); // For read json


//Routing
app.use("/api", authRouter)
app.use("/api", userRouter )

//Error
app.use(handleErrors)
// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on pport ${PORT}`));
```