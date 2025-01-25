"use client"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import ApiResponse from '@/types/ApiResponse'
import { verifyCodeSchema } from '@/zodSchemas/verifyCode'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const VerifyCode = () => {

    const { username } = useParams<{ username: string }>()
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
    })
    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
        try {
            const response = await axios.post<ApiResponse>("/api/verify-code", { username, verifyCode: data.code.toString() });
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message
                })
                router.push("/sign-in")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} placeholder='Enter verification code' />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyCode
