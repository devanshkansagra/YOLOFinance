import { Request, Response } from "express";
import { sendEmail } from "../handlers/sendEmail";

export const handleFeedback = async (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res
            .status(400)
            .json({ success: false, error: "All fields required" });
    }

    try {
        // Send feedback to admin
        await sendEmail({
            from: process.env.GMAIL_USER,
            to: process.env.FEEDBACK_RECEIVER_EMAIL,
            replyTo: email,
            subject: `New Feedback from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `
                <div style="background:#f4f8fb;padding:32px 0;">
                  <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #0001;padding:32px 32px 24px 32px;">
                    <div style="text-align:center;margin-bottom:24px;">
                      <img src="https://i.imgur.com/0y0y0y0.png" alt="YOLOFinance Logo" style="height:48px;margin-bottom:8px;" />
                      <h2 style="color:#1976d2;margin:0;font-size:2rem;">New Feedback Received</h2>
                    </div>
                    <div style="font-size:1.1rem;color:#222;">
                      <p><strong>Name:</strong> ${name}</p>
                      <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#1976d2;text-decoration:none;">${email}</a></p>
                      <div style="margin:24px 0;">
                        <strong>Message:</strong>
                        <div style="background:#f7fafc;padding:18px 20px;border-radius:10px;border:1px solid #e3e8ee;margin-top:8px;font-size:1rem;line-height:1.6;">
                          ${message}
                        </div>
                      </div>
                    </div>
                    <div style="text-align:center;color:#888;font-size:0.95rem;margin-top:32px;">
                      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                      <span>YOLOFinance Feedback System</span>
                    </div>
                  </div>
                </div>
            `,
        });

        // Send thank you email to user
        await sendEmail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Thank you for your feedback!",
            html: `
                <div style="background:#f4f8fb;padding:32px 0;">
                  <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #0001;padding:32px 32px 24px 32px;">
                    <div style="text-align:center;margin-bottom:24px;">
                      <img src="https://i.imgur.com/0y0y0y0.png" alt="YOLOFinance Logo" style="height:48px;margin-bottom:8px;" />
                      <h2 style="color:#1976d2;margin:0;font-size:2rem;">Thank You, ${name}!</h2>
                    </div>
                    <div style="font-size:1.1rem;color:#222;">
                      <p>We appreciate you taking the time to share your feedback with us.</p>
                      <p>Our team will review your message and get back to you if necessary.</p>
                      <div style="margin:32px 0 0 0;">
                        <a href="http://localhost:5173/" style="background:#1976d2;color:#fff;text-decoration:none;padding:12px 32px;border-radius:24px;font-weight:bold;display:inline-block;">Visit YOLOFinance</a>
                      </div>
                    </div>
                    <div style="text-align:center;color:#888;font-size:0.95rem;margin-top:32px;">
                      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                      <span>YOLOFinance Team &bull; <a href="mailto:support@yolofinance.com" style="color:#1976d2;text-decoration:none;">support@yolofinance.com</a></span>
                    </div>
                  </div>
                </div>
            `,
            text: `Hi ${name},\n\nThank you for reaching out to us. We appreciate your feedback and will get back to you if needed.\n\nBest regards,\nYOLOFinance Team`,
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Email send error:", err);
        res.status(500).json({ success: false, error: "Failed to send email" });
    }
};
