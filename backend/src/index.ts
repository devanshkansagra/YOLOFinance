import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes";
import { connectToMongodb } from "./database/config";
import cookieParser from "cookie-parser";
import { fetchNAVData } from "./controllers/fetchNavController";
import { fetchFinanceNews } from "./controllers/newsController";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { sendEmail } from "./handlers/sendEmail";
import { handleFeedback } from "./controllers/feedbackController";
import feedbackRoutes from "./routes/feedback";

// import "./cron/emailReminderCron";

const app = express();
dotenv.config();
connectToMongodb(process.env.CONNECTION_STRING as string);

app.use(cors({
  origin: process.env.ORIGIN as string, // Your frontend URL
  credentials: true, // CRITICAL: Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT;

// ✅ create reusable transporter object using Gmail + App Password
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // your 16-char app password
    },
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.get("/fetch-mf-data", fetchNAVData);

app.get("/api/news", fetchFinanceNews);

// API endpoint to serve insurance data
app.get("/fetchInsurance", (req, res) => {
    const filePath = path.join(__dirname, "mock-insurance.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to load insurance data" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// ✅ API endpoint to serve gov bonds data
app.get("/fetchGovBonds", (req, res) => {
    const filePath = path.join(__dirname, "gov-bonds.json"); // make sure the file is placed in dist/ or same folder after build
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading gov-bonds.json:", err);
            res.status(500).json({ error: "Failed to load gov bonds data" });
        } else {
            try {
                res.json(JSON.parse(data));
            } catch (parseErr) {
                console.error("Error parsing gov-bonds.json:", parseErr);
                res.status(500).json({
                    error: "Invalid gov bonds data format",
                });
            }
        }
    });
});

app.use(feedbackRoutes);

app.listen(port, function () {
    console.log(`Server started at port ${port}`);
});
