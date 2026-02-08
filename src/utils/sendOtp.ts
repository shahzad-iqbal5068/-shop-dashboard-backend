import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // The 16-character code goes here
      },
    });

    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return false;
  }
};
