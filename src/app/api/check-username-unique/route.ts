import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameSchema } from "@/zodSchemas/signUpSchema";
import { z } from "zod";

const usernameSchemaObject = z.object({
    username: usernameSchema
})

export async function GET(request: Request) {
    await dbConnect()
    try {

        const { searchParams } = new URL(request.url)
        const verifiedUsername = {
            username: searchParams.get("username")
        }
        const result = usernameSchemaObject.safeParse(verifiedUsername)
        console.log("Verified Username :-", result.error?.format().username ?._errors.join(","))
        if (!result.success) {
            return Response.json({
                success: false,
                message:  result.error?.format().username ?._errors.join(" , ") || "Something went wrong while verifying username"
            }, { status: 400 })
        }
        const user = await UserModel.findOne({ username: result.data.username, isVerified: true })
        if (user) {
            return Response.json({
                success: false,
                message: "username already exist"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 200 })
    } catch (error: any) {
        console.log("error in check username", error)
        return Response.json({
            success: false,
            message: error.message
        }, { status: 500 })

    }
}