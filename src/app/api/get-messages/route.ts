import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user = session?.user as User

    if (!user || !user._id) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, {
            status: 401,
        })
    }
    try {
        const existedUser = await UserModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(user._id) } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])
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
            messages: existedUser.length == 0 ? [] : existedUser[0].messages
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