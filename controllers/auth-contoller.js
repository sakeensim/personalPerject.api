
const createError = require("../utils/createError")
exports.register = (req,res,next) =>{
    //code   
    try{
    //step 1 req.body
    const {email, firstname,lastname,password, confirmpassword} = req.body

    //step 2 validate
    if(!email){
        return createError(400, "email is require")
    }
    if(!firstname){
        return createError(400, "firstname is require")
    }
    //step 3 Check already
    //step 4 Encrypt bcrypt
    //step 5 Inser to DB
    //step 6 Response

       res.json({message  : "hello register"})
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