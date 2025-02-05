
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

exports.currentUser = async(req,res,next)=>{
    try {
        res.json({message: "Hello,current user"})
    } catch (error) {
        next(error)
    }
}