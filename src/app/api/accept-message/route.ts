import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { acceptMessageSchema } from "@/zodSchemas/acceptMessageSchema";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOption)
    const user = session?.user as User
    if (!user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, {
            status: 401,
        })
    }

    try {
        const { acceptMessage } = await request.json()

        const result=acceptMessageSchema.safeParse({acceptMessage})

        if (!result.success) {
            return Response.json({
                success: false,
                message: result.error.errors[0].message
            }, {
                status: 400
            })
        }
        const existedUser = await UserModel.findOne({ _id: user?._id })
        if (!existedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        existedUser.isAcceptingMessage = acceptMessage
        await existedUser.save()
        return Response.json({
            success: true,
            message: "Accept message updated successfully",
        }, {
            status: 200
        })

    } catch (error: any) {
        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500

        })
    }
}

export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user = session?.user as User
    console.log('user->', user)
    if (!user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, {
            status: 401,
        })
    }

    try {
        const existedUser = await UserModel.findOne({ _id: user?._id })
        if (!existedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Accept message updated successfully",
            data: {
                acceptMessage: existedUser.isAcceptingMessage
            }
        }, {
            status: 200
        })

    } catch (error: any) {
        return Response.json({
            success: false,
            message: error.message
        }, {
            status: 500

        })
    }
}