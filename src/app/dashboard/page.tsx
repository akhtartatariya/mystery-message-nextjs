"use client"

import MessageBox from "@/components/MessageBox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/models/user.model"
import ApiResponse from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
const page = () => {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [isToggleLoading, setIsToggleLoading] = useState(false)
    const [isMessageLoading, setIsMessageLoading] = useState(false)
    const { toast } = useToast()
    const { register, handleSubmit, setValue, watch } = useForm()
    const acceptMessage = watch('acceptMessage')
    const handleMessageDelete = (messageId: Message["_id"]) => {
        setMessages(messages.filter((message) => (
            message._id !== messageId
        )))
    }
    const getMessages = useCallback(async (refresh = false) => {
        try {
            setIsMessageLoading(true)
            setIsToggleLoading(true)
            const response = await axios.get<ApiResponse>("/api/get-messages")
            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message
                })
            }

            if (refresh) {
                toast({
                    title: "Success",
                    description: "Refreshed messages"
                })
            }
            setMessages(response.data.messages || [])

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message
            })
        }
        finally {
            setIsMessageLoading(false)
            setIsToggleLoading(false)
        }
    }, [setIsMessageLoading, setMessages, session])
    const getToggleStatus = useCallback(async () => {
        try {
            setIsToggleLoading(true)
            const response = await axios.get('/api/accept-message')
            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message
                })
            }
            setValue('acceptMessage', response.data.data.acceptMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message
            })
        }
        finally {
            setIsToggleLoading(false)
        }
    }, [setIsToggleLoading, setValue])
    const changeToggleStatus = useCallback(async () => {
        try {
            setIsToggleLoading(true)
            const response = await axios.post('/api/accept-message', {
                acceptMessage: !acceptMessage
            })
            setValue('acceptMessage', !acceptMessage)
            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message
                })
            }
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message
            })
        }
        finally {
            setIsToggleLoading(false)
        }
    }, [acceptMessage, setValue, setIsToggleLoading])
    useEffect(() => {
        if (!session || !session.user) return

        getToggleStatus()
        getMessages()
    }, [getMessages, setMessages, session, setValue])
    const baseUrl = `${window?.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${session?.user.username}`
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "Copied to clipboard",
            description: profileUrl
        })
    }
    if (!session || !session.user) return <> <div className="text-red-500 text-center my-8" > Please login first</div></>

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessage')}
                    checked={acceptMessage}
                    onCheckedChange={changeToggleStatus}
                    disabled={isToggleLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessage ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    getMessages(true);
                }}
            >
                {isMessageLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageBox
                            key={index}
                            message={message}
                            onMessageDelete={handleMessageDelete}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default page
