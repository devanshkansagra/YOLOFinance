import { AuthRequest } from "../definitions/AuthRequest";
import Stripe from "stripe";
import Insurance from "../model/insuranceModel";
import { Response } from "express";
export async function BuyInsurance(req: AuthRequest, res: Response) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  try {
    const {
      policyID,
      insurer,
      planType,
      planName,
      premium,
      coverage,
      claimRatio,
    } = req.body;

    const user = req.user._id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: planName,
            },
            unit_amount: parseInt(premium.replace(/[^0-9]/g, ""), 10) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: process.env.ORIGIN + "/Dashboard",
      cancel_url: "http://localhost:5173/cancel",
    });
    if (session) {
      const newInsurance = new Insurance({
        userId: user,
        policyId: policyID,
        insurer,
        planType,
        planName,
        premium,
        coverage,
        claimRatio,
      });
      const response = await newInsurance.save();
      if (response) {
        res.status(201).send({
          message: "success",
          url: session.url,
          id: session.id,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export async function fetchInsurance(req: AuthRequest, res: Response) {
  try {
    const user = req.user._id;
    // console.log(user);
    const insurances = await Insurance.aggregate([
      {
        $match: { userId: user, isCancelled: false },
      },
      {
        $group: {
          _id: "$policyId",
          planName: { $first: "$planName" },
          planType: { $first: "$planType" },
          insurer: { $first: "$insurer" },
          premium: { $first: "$premium" },
          coverage: { $first: "$coverage" },
          claimRatio: { $first: "$claimRatio" },
        },
      },
    ]);

    res.status(200).send({ insurances });
  } catch (error) {
    console.error("Get Insurances error:", error);
    res.status(500).send({ message: "Failed to fetch insurances" });
  }
}

export async function cancelPolicy(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?._id;
    const { policyId } = req.body;

    if (!policyId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing policyId" });
    }

    const insurance = await Insurance.findOne({
      policyId,
      userId,
    });

    if (!insurance) {
      return res
        .status(404)
        .json({ success: false, message: "Investment not found" });
    }

    insurance.isCancelled = true;
    await insurance.save();

    return res.json({
      success: true,
      message: "Policy cancelled successfully",
    });
  } catch (error: any) {
    console.error("❌ Cancel insurance error:", error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getInsurance(req: AuthRequest, res: Response) {
  const { id } = req.params;
  try {
    const userInsurance = await Insurance.find({userId: id, isCancelled: false});
    if(!userInsurance) {
      return res.status(404).send({message: "No insurances found"});
    }
    res.status(200).send({message: "Insurance fetched successfully", data: userInsurance})
  } catch (error) {
    console.log(error);
  }
}
