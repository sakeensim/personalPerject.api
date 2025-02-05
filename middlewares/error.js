const handleErrors = (err,req,res,next)=>{
    console.log("step 3 handle error")
    res
    .status(err.stautusCode || 500)
    .json({message: err.message || "Something went wrong!!"})
}

module.exports = handleErrors;


//เพราะมีฟังชันเดียวเลยใช้ module.exports ได้เลย