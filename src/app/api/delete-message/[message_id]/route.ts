import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { getServerSession, User } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
dbConnect()
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ message_id: string }> }) {
    const messageid = (await params).message_id
    dbConnect()
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

        const deletedMessage = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageid } } })
        if (deletedMessage.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or unable to be deleted"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, {
            status: 200
        })



    } catch (error: any) {
        console.log("Error deleting message", error)
        return Response.json({
            success: false,
            message: error.message
        }
        )
    }
}