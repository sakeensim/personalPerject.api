
exports.register = (req,res,next) =>{
    //code   
    try{
    //step 1 req.body
    console.log(req.body)
    //step 2 validate
    //step 3 Check already
    //step 4 Encrypt bcrypt
    //step 5 Inser to DB
    //step 6 Response

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