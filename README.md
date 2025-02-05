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