import ApiResponse from '@/types/ApiResponse';
import transport from '@/lib/nodemailer';
import VerificationEmail from '../../template/EmailTemplate';
interface emailOptions {
    from: string;
    to: string;
    subject: string;
    html: any;
}
async function sendEmail({ username, verifyCode, email }: any): Promise<ApiResponse> {

    try {

        const emailOptions: emailOptions = {
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
            to: email,
            subject: "Verification Code",
            html: VerificationEmail({ username, otp: verifyCode })
        }

        await transport.sendMail(emailOptions);

        return {
            success: true,
            message: 'Email sent successfully'
        }
    } catch (error) {
        console.error(" Failed to send email to user", error);
        return {
            success: false,
            message: 'Failed to send email'
        }
    }

}

export default sendEmail;