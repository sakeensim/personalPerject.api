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