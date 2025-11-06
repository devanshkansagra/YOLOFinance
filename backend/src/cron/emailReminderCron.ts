import cron from "node-cron";
import UserInvestments from "../model/userInvestment";
import { User } from "../model/user";
import { sendEmail } from "../handlers/sendEmail";

// Runs every minute (for testing)
cron.schedule("* * * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const investments = await UserInvestments.find({ reminderSent: false });

    for (const investment of investments) {
      if (!investment.nextDate) continue;

      const dueDate = new Date(investment.nextDate);
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      // send reminder only once, 5 days before due date
      if (diffDays === 5) {
        const user = await User.findById(investment.userId);
        if (!user || !user.email) continue;

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: "Mutual Fund SIP Due Reminder",
          text: `Dear ${user.name},\n\nYour SIP for ${investment.schemeName} is due on ${dueDate.toDateString()}. Please ensure your account has sufficient balance.\n\nThank you!`,
        };

        await sendEmail(mailOptions);

        // ✅ mark as reminder sent
        investment.reminderSent = true;
        await investment.save();
      }
    }
  } catch (error) {
    console.error("Error in SIP reminder cron job:", error);
  }
});
