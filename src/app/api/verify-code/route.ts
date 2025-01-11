import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { verifyCodeSchema } from "@/zodSchemas/verifyCode";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, verifyCode } = await request.json()
        const result = verifyCodeSchema.safeParse({ code: verifyCode })
        console.log(" verify result", result.data)
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }

        const isValidCode = user.verifyCode === result.data?.code
        const isNotExpiredCode = user.verifyCodeExpiresAt ? new Date(user.verifyCodeExpiresAt) > new Date() : false
        if (isValidCode && isNotExpiredCode) {
            user.isVerified = true
            user.verifyCode = undefined
            user.verifyCodeExpiresAt = undefined
            await user.save()
            return Response.json({
                success: true,
                message: "user verified"
            }, { status: 200 })
        }
        else if (!isNotExpiredCode) {
            return Response.json({
                success: false,
                message: "code expired"
            }, { status: 400 })
        }
        else {
            return Response.json({
                success: false,
                message: "invalid code"
            }, { status: 400 })
        }

    } catch (error: any) {
        console.log("error in verify code", error)
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}