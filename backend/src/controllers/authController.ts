import { Request, Response } from "express";
import { createTransport } from "nodemailer";
import { User } from "../model/user";
import bcrypt from "bcrypt";
import { sendEmail } from "../handlers/sendEmail";
export async function generateOTP(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      const mailOptions = {
        from: process.env.GMAIL_USER as string,
        to: email as string,
        subject: "New OTP Generated!",
        text: "Your OTP: " + otp,
      };

      try {
        const info = await sendEmail(mailOptions)
        res
          .cookie("otp", otp, {
            httpOnly: true, // prevents JS access
            maxAge: 5 * 60 * 1000, // 5 minutes
            secure: false,
            path: "/",
          })
          .status(200)
          .send({ message: "OTP sent successfully on email" });
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    }
    else {
      res.status(404).send({message: "No email found"});
    }
  } catch (error) {
    console.log(error);
  }
}

export async function verifyOTP(req: Request, res: Response) {
  const { otp } = req.cookies;
  const { data } = req.body;

  if (otp === data) {
    res.status(200).send({ message: "OTP Verified" });
  } else {
    res.status(403).send({ message: "Invalid otp" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const updatedPassword = await bcrypt.hash(password as string, 10);
      if (user.authProvider !== "Google") {
        await user.updateOne({ password: updatedPassword });

        res.status(200).send({ message: "Password Updated Successfully" });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
