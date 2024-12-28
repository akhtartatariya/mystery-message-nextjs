import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    messages: Message[];
    verifyCode: string;
    verifyCodeExpiresAt: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    messages: [messageSchema],
    verifyCode: {
        type: String,
        required: [true, "Verify Code is Required"]
    },
    verifyCodeExpiresAt: {
        type: Date,
        required: [true, "Verify Code expires at is Required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, })

const User = mongoose.models.users as mongoose.Model<User> || mongoose.model<User>("users", userSchema);

export default User;