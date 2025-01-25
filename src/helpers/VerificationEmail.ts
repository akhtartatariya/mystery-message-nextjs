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
    try {
        
        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
        const emailOptions: emailOptions = {
            from: 'Mystery Message ',
            to: email,
            subject: "Verification Code",
            html: emailHtml
        }

        await transport.sendMail(emailOptions);
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