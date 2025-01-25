"use client"

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import ApiResponse from '@/types/ApiResponse'
import { messageSchema } from '@/zodSchemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const page = () => {
    const { username } = useParams()
    const { toast } = useToast()
    const [suggestMessage, setSuggestMessage] = useState<string[]>([])
    const [isSuggestingMessage, setIsSuggestingMessage] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { register, handleSubmit, setValue } = useForm<z.infer<typeof messageSchema>>({
    })
    const sendMessage = async (data: z.infer<typeof messageSchema>) => {

        try {
            setIsSubmitting(true)
            setErrorMessage(null)
            const response = await axios.post<ApiResponse>(`/api/send-messages`, { username, content: data.content })
            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message
                })
                setErrorMessage(response.data.message)
            }
            toast({
                title: "Success",
                description: "Message sent successfully"
            })

            setValue("content", "")

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message
            })

            setErrorMessage(axiosError.response?.data?.message || "Something went wrong")
        }
        finally {
            setIsSubmitting(false)

        }
    }

    const suggestMessages = useCallback(async () => {

        try {
            setIsSuggestingMessage(true)
            const response = await axios.get<ApiResponse>(`/api/suggest-message`)
            if (!response.data.success) {
                toast({
                    title: "Error",
                    description: response.data.message
                })
            }

            setSuggestMessage(response.data.data || [])
            toast({
                title: "Success",
                description: "Suggested messages are ready"
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message
            })
        }

        finally {
            setIsSuggestingMessage(false)
        }
    }, [setSuggestMessage])
    useEffect(() => {
        suggestMessages()
    }, [])


    return (
        <div className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center'>
            <h1 className='text-4xl font-bold text-center '>Public Profile Link</h1>
            <p className=' text-left mt-4 font-medium text-sm'>Send Anonymous Message to {username}</p>
            <form className="grid w-full gap-2 mt-2 " onSubmit={handleSubmit(sendMessage)}>
                <Textarea placeholder="Type your message here." className=' resize-none' {...register('content')} />
                {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
                <Button type='submit' className='w-40 mx-auto' disabled={isSubmitting}>Send message</Button>
            </form>
            <Button className='mt-20 w-40' onClick={suggestMessages} disabled={isSuggestingMessage}>{isSuggestingMessage ? (isSuggestingMessage && <Loader2 className='animate-spin mx-auto' />) : "Suggest Messages"}</Button>
            <p className='mt-4 text-base'>Click on any message below to select it.</p>
            <div className=' border border-gray-200 p-4 rounded-xl mt-4' >
                <h3 className='text-xl font-semibold '>Messages</h3>

                {suggestMessage?.map((message, index) => (
                    <p key={index} className='text-center mt-2 text-sm cursor-pointer hover:underline border border-gray-200 p-2 rounded-lg' onClick={() => setValue('content', message)}>{message}</p>
                ))}
            </div>
            <Separator />
            <p className='text-center mt-4 text-base'>Get Your Message Board</p>
            <Link href='/sign-up' className='text-center'><Button className='w-40 px-4 py-2 mt-4 '>Create Your Account</Button></Link>

        </div>
    )
}

export default page
