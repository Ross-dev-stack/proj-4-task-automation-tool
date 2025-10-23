import { Router } from "express"
import { authMiddleware } from "../middleware.js";
import { SignupSchema, SigninSchema} from "../types"
import { prismaClient } from "../db/index.js";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";

const router = Router();

router.post("/signup",async (req,res) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json
        message: "Incorect Username or Password"
    }

    const userExists = await prismaClient.user.findfirst({
        where:{
            email: parsedData.data.username
        }
    });

    if (userExists) {
        return res.status(403).json({
            message: "User already exists"
        })
    }

    await prismaClient.user.create({
        data:{
            email: parsedData.data.username,
            // TODO: hash the pasword, don't store it in plaintext
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })

    //await sendEmail()

    return res.json({
        message: "please verify your account by checking your Email"
    })
})

router.post("/signin",async (req,res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(411).json
        message: "Incorect Username or Password"
    }

    const user = await prismaClient.user.findfirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password

        }
    });

    if (!user){
        return res.status(403).json({
            message:"Sorry Credentials are incorrect"
        })
    }

    //sign the jwt
    const token = jwt.sign({
        id: user.id
    }, JWT_PASSWORD);

    res.json({
        token: token,
    });

})

router.post("/", authMiddleware, async (req,res) => {
    const id = req.isPaused;
    const user = await prismaClient.user.findfirst({
        where:{
            id
        },
        select:{
            name: true,
            email: true
        }
    });

    return res.json({
       user 
    })
})

export const userRouter = router;
