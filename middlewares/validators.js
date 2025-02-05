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