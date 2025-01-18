import nextAuth from "next-auth";
import { JWT } from "next-auth/jwt"
declare module "next-auth"{
    interface User {
        _id: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        email?: string;
        username?: string;
        
    }
    interface Session {
        user: {
            _id: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            email?: string;
            username?: string;
        }
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        email?: string;
        username?: string;
    } 
}

