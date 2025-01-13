"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Message } from "@/models/user.model"
import ApiResponse from "@/types/ApiResponse"
type messageProps = {
    message: Message
    onMessageDelete: (messageId: Message["_id"]) => void
}

const MessageBox = ({message,onMessageDelete}: messageProps) => {
    const {toast}=useToast()

    const handleDelete = async() => {
        const response=await axios.delete<ApiResponse>(`/api/messages/${message._id}`)
        toast({
            title:response.data.message

        })
        onMessageDelete(message._id)
    }

    return (

        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline"><X className="h-4 w-4" / ></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
           
        </Card>

    )
}

export default MessageBox
