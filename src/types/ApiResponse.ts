
import { Message } from "@/models/user.model";
 interface ApiResponse {
    success: boolean;
    message: string;
    messages?: Array<Message>;
    isAcceptingMessage?: boolean;
}

export default ApiResponse