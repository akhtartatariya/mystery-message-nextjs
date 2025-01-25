import sendEmail from "@/helpers/VerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { signUpSchema } from "@/zodSchemas/signUpSchema";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()

        const result = signUpSchema.safeParse({ username, email, password })

        if (!result.success) {
            return Response.json({
                success: false,
                message: result.error.errors[0].message
            }, {
                status: 400
            })
        }
        const existedUserByUsername = await UserModel.findOne({ username, isVerified: true })
        if (existedUserByUsername) {
            return Response.json({
                success: false,
                message: "username already exist"
            }, { status: 400 })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const existedUserByEmail = await UserModel.findOne({ email })
        if (existedUserByEmail) {
            if (existedUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exist"
                }, { status: 400 })
            }
            else {
                const verifyCodeExpiresAt = new Date()
                verifyCodeExpiresAt.setHours(verifyCodeExpiresAt.getHours() + 1)
                const hashedPassword = await bcrypt.hash(password, 10)
                existedUserByEmail.username = username
                existedUserByEmail.password = hashedPassword
                existedUserByEmail.verifyCode = verifyCode
                existedUserByEmail.verifyCodeExpiresAt = verifyCodeExpiresAt
                await existedUserByEmail.save()
            }
        }
        else {
            const verifyCodeExpiresAt = new Date()
            verifyCodeExpiresAt.setHours(verifyCodeExpiresAt.getHours() + 1)
            const hashedPassword = await bcrypt.hash(password, 10)
            await UserModel.create({
                username,
                email,
                password: hashedPassword,
                messages: [],
                verifyCode,
                verifyCodeExpiresAt,
                isVerified: false,
                isAcceptingMessage: true,
            })
        }

        const { success, message } = await sendEmail({ username, verifyCode, email })
        if (!success) {
            return Response.json({
                success: false,
                message: message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User Verified Successfully please check your email"
        }, { status: 201 })

    } catch (error: any) {
        console.log(" unable to create user", error)
        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500
        })
    }
}