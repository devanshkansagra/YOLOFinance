import { Response } from "express";
import UserInvestments from "../model/userInvestment";
import { AuthRequest } from "../definitions/AuthRequest";
import Stripe from "stripe";
import { sendEmail } from "../handlers/sendEmail";
import { makePayment } from "../handlers/payment";
import { url } from "inspector";
import { send } from "process";
export async function mfBuyController(req: AuthRequest, res: Response) {
  try {
    const {
      schemeCode,
      schemeName,
      frequency,
      startDate,
      amount,
      nav,
      units,
      nextDate,
    } = req.body;

    const { _id: user, name, email } = req.user;

    const session = await makePayment({
      amount,
      name: schemeName,
      schemeCode: String(schemeCode),
      schemeName,
      frequency,
      startDate,
      nav,
      units,
      nextDate,
      userId: String(user),
      email,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.log(error);
  }
}

export async function getMFs(req: AuthRequest, res: Response) {
  try {
    const { _id: user } = req.user;
    const investments = await UserInvestments.aggregate([
      {
        $match: { userId: user, isCancelled: false }, // ✅ skip cancelled SIPs
      },
      {
        $group: {
          _id: "$schemeCode",
          schemeName: { $first: "$schemeName" },
          schemeCode: { $first: "$schemeCode" },
          amount: { $first: "$amount" },
          nav: { $first: "$nav" },
          units: { $first: "$units" },
          date: { $first: "$date" },
        },
      },
    ]);
    res.status(200).send({ investments });
  } catch (error) {
    console.error("Get MFs error:", error);
    res.status(500).send({ message: "Failed to fetch investments" });
  }
}

export async function cancelMF(req: AuthRequest, res: Response) {
  try {
    const { _id: userId, email, name } = req.user;
    const { schemeCode, schemeName } = req.body;

    if (!schemeCode) {
      return res
        .status(400)
        .json({ success: false, message: "Missing schemeCode" });
    }

    const investment = await UserInvestments.findOne({
      schemeCode,
      userId,
    });

    if (!investment) {
      return res
        .status(404)
        .json({ success: false, message: "Investment not found" });
    }

    investment.isCancelled = true;
    await investment.save();

    res.json({
      success: true,
      message: "SIP cancelled successfully",
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Mutual Fund SIP Cancellation Acknowledgement",
      text: `Dear ${name},\n\nYour SIP details for ${schemeName} have been successfully cancelled.\n\nThank you for investing with us!\n\nBest regards,\nThe Investment Team`,
    };

    await sendEmail(mailOptions);
  } catch (error: any) {
    console.error("❌ Cancel SIP error:", error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateMF(req: AuthRequest, res: Response) {
  const { _id, email, name } = req.user;
  const { schemeCode, schemeName, amount, date } = req.body;
  try {
    const updateResponse = await UserInvestments.updateOne(
      { userId: _id, schemeCode: schemeCode },
      { $set: { amount: amount, nextDate: date } }
    );
    if (updateResponse.modifiedCount === 1) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Mutual Fund SIP Update Acknowledgement",
        text: `Dear ${name},\n\nYour SIP details for ${schemeName} have been successfully updated on ${date}.\n\nPlease review the changes and ensure all information is correct.\n\nThank you for investing with us!\n\nBest regards,\nThe Investment Team`,
      };

      const mailResponse = await sendEmail(mailOptions);

      if (mailResponse.accepted) {
        res.status(200).json({ message: "Mutual fund updated Successfully" });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function confirmPayment(req: AuthRequest, res: Response) {
  const { sessionId } = req.body;
  const { _id: user, name, email } = req.user;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const { metadata, payment_status } =
      (await stripe.checkout.sessions.retrieve(sessionId)) as any;
      
    const newInvestment = new UserInvestments({
      userId: user,
      schemeCode: metadata.schemeCode,
      schemeName: metadata.schemeName,
      frequency: metadata.frequency,
      startDate: metadata.startDate,
      amount: metadata.amount,
      nextDate: metadata.nextDate,
    });

    if (payment_status === "paid") {
      await newInvestment.save();

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Systematic Investment Plan Activated for ${metadata.schemeName}`,
        text: `
          Dear ${name},

          We’re pleased to inform you that your Systematic Investment Plan (SIP) has been successfully initiated.
          Here are your SIP details:
          • Scheme Name: ${metadata.schemeName}
          • Investment Amount: ₹${metadata.amount}
          • Frequency: Monthly
          • Start Date: ${metadata.startDate}
          • Next Installment Date: ${metadata.nextDate}

          Your SIP will automatically continue as per the chosen frequency. Please ensure your account has sufficient balance on the due date to avoid any interruptions.

          Thank you for investing with us.

          Best regards,  
          Investment Team
        `,
      };

      res.status(201).send({ message: "New Investment Made Successfully" });
      await sendEmail(mailOptions);
    }
  } catch (error) {
    console.log(error);
  }
}
