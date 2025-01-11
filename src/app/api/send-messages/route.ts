import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/user.model";
export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, message } = await request.json();
        const existedUser = await UserModel.findOne({ username })
        if (!existedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        //check if user accepting the messages
        if (!existedUser.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User not accepting messages"
            }, {
                status: 403
            })
        }
        const newMessage = {
            content: message,
            createdAt: new Date()
        } as Message
        existedUser.messages.push(newMessage)
        await existedUser.save()

        return Response.json({
            success: true,
            message: "Message sent successfully"
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