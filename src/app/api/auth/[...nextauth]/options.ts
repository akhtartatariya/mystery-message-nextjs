import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import bcrypt from "bcrypt"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user.model"
import { signInSchema } from "@/zodSchemas/signInSchema"

export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const result = signInSchema.safeParse({ identifier: credentials.identifier, password: credentials.password })
                    if (!result.success) {
                        throw new Error(result.error.errors[0].message)
                    }

                    const user = await UserModel.findOne({
                        $or: [
                            { email: result.data.identifier },
                            { username: result.data.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found")
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified please sign up first")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid credentials")
                    }
                    return user
                } catch (error: any) {
                    
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) { 
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user.isAcceptingMessage
            token.email = user.email
            token.username = user.username
        }
        return token
        
    },
    async session({ session, token }) {
        if (token) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessage = token.isAcceptingMessage
            session.user.email = token.email
            session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,
}