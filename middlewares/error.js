const handleErrors = (err,req,res,next)=>{

    res
    .status(err.stautusCode || 500)
    .json({message: err.message || "Something went wrong!!"})
}

module.exports = handleErrors;


//เพราะมีฟังชันเดียวเลยใช้ module.exports ได้เลย