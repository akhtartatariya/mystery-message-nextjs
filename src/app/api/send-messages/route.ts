import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/user.model";
import { messageSchema } from "@/zodSchemas/messageSchema";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, content } = await request.json();

        const result = messageSchema.safeParse({content})

        if (!result.success) {
            return Response.json({
                success: false,
                message: result.error.errors[0].message
            }, {
                status: 400
            })
        }
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
            content,
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