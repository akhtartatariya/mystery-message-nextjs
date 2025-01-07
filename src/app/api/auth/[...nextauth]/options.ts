import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import bcrypt from "bcrypt"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/user.model"


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
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.email }
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
                } catch (error) {
                    console.log(" credentials auth error in sign in ", error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (!user) {
                throw new Error("No user found")
            }
            token.id = user._id.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user.isAcceptingMessage
            token.email = user.email
            return token
        },
        async session({ session, token }) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessage = token.isAcceptingMessage
            session.user.email = token.email
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