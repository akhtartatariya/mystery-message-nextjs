"use client"

import { useEffect, useState } from "react"
import { useDebounceCallback  } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signUpSchema } from "@/zodSchemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { z } from "zod"
import ApiResponse from "@/types/ApiResponse"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const SignUp = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [usernameCheckingLoader, setUsernameCheckingLoader] = useState(false)
    const [isFormSubmit, setIsFormSubmit] = useState(false)
    const { toast } = useToast()

    const router = useRouter()
    const debounced =  useDebounceCallback(setUsername, 1000)
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (!username) {
                setUsernameMessage("")
                return
            }
            setUsernameCheckingLoader(true)
            setUsernameMessage("")

            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`)
                if (!response.data.success) {
                    throw new Error(response.data.message)
                }
                setUsernameMessage(response.data.message)

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                setUsernameMessage(axiosError.response?.data?.message ?? "Invalid Username ")
                toast({
                    title: "Error",
                    description: axiosError.response?.data?.message ?? "Invalid Username ",
                    variant: "destructive",
                    duration: 2000
                })
            }
            finally {
                setUsernameCheckingLoader(false)
            }
        }

        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsFormSubmit(true)
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast({
                title: "Success",
                description: response.data.message,
            })

            router.push(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data?.message ?? "Something went wrong while signing up"
            })
        }
        finally {
            setIsFormSubmit(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} 
                                        onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }} />
                                    </FormControl>
                                    {usernameCheckingLoader && (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    )}

                                    {usernameMessage && <p className={`mt-1 text-sm ${usernameMessage === "username is unique" ? " text-green-500" : " text-red-500"}`}>{usernameMessage}</p>}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder=" ••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isFormSubmit}>{isFormSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
