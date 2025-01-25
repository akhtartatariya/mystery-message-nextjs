import ApiResponse from '@/types/ApiResponse';
import transport from '@/lib/nodemailer';
import VerificationEmail from '../../template/EmailTemplate';
import { render } from '@react-email/components';
interface emailOptions {
    from: string;
    to: string;
    subject: string;
    html: any  
}
async function sendEmail({ username, verifyCode, email }: any): Promise<ApiResponse> {
    console.log(" Sending Email to",transport)
    try {
        
        console.log(" in try Sending Email to",transport)
        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
        const emailOptions: emailOptions = {
            from: 'Mystery Message ',
            to: email,
            subject: "Verification Code",
            html: emailHtml
        }

        const emailResponse = await transport.sendMail(emailOptions);
        console.log("emailResponse",emailResponse)
        return {
            success: true,
            message: 'Email sent successfully'
        }
    } catch (error: any) {
        console.error(" Failed to send email to user", error);
        return {
            success: false,
            message: error || "Couldn't send email"
        }
    }

}

export default sendEmail;