
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