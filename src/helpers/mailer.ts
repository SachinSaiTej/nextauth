import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set:{
                    verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000
                }
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set:{
                    forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000
                }
            });
        }

        // const transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: process.env.MAIL_USER,
        //         pass: process.env.MAIL_PASS
        //     }
        // });

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "10b213b7675b41",
                pass: "133a05f37d116c"
            }
        });

        const mailOptions = {
            from: 'sai@gmail.com',
            to: email,
            subject: emailType,
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === 'VERIFY' ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>`
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message)
    }
}