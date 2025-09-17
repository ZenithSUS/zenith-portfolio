"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { MongoRateLimiter } from "@/lib/rate-limiter";

export const rateLimiter = new MongoRateLimiter({
  emailLimit: 3, // 3 emails per hour per email address
  ipLimit: 10, // 10 attempts per hour per IP
  timeWindowMs: 60 * 60 * 1000, // 1 hour window
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  const cfConnectingIP = headersList.get("cf-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return realIP || cfConnectingIP || "unknown";
}

export async function sendMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Input validation
  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  if (!email.includes("@") || email.length > 254) {
    return { success: false, error: "Invalid email address" };
  }

  if (message.length > 5000) {
    return { success: false, error: "Message too long" };
  }

  const clientIP = await getClientIP();

  try {
    // Check both email and IP rate limits
    const [emailCheck, ipCheck] = await Promise.all([
      rateLimiter.checkRateLimit(email, "email"),
      rateLimiter.checkRateLimit(clientIP, "ip"),
    ]);

    if (!emailCheck.allowed) {
      return {
        success: false,
        error: emailCheck.reason,
        rateLimited: true,
        resetTime: emailCheck.resetTime,
        remaining: emailCheck.remaining,
      };
    }

    if (!ipCheck.allowed) {
      return {
        success: false,
        error: ipCheck.reason,
        rateLimited: true,
        resetTime: ipCheck.resetTime,
        remaining: ipCheck.remaining,
      };
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `📩 New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nIP: ${clientIP}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #00cfff; margin-bottom: 10px;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>IP Address:</strong> ${clientIP}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f4f4f4; border-left: 4px solid #00cfff; border-radius: 5px;">
            <p style="margin: 0; white-space: pre-line;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            This message was sent from your portfolio website.<br>
            Remaining: ${emailCheck.remaining} emails from this address, ${ipCheck.remaining} from this IP
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Record successful attempts
    await Promise.all([
      rateLimiter.recordAttempt(email, "email", true),
      rateLimiter.recordAttempt(clientIP, "ip", true),
    ]);

    return {
      success: true,
      message: "Email sent successfully",
      remaining: {
        email: emailCheck.remaining,
        ip: ipCheck.remaining,
      },
    };
  } catch (error) {
    console.error("Error sending email:", error);

    // Record failed attempts to prevent spam
    try {
      await Promise.all([
        rateLimiter.recordAttempt(email, "email", false),
        rateLimiter.recordAttempt(clientIP, "ip", false),
      ]);
    } catch (recordError) {
      console.error("Error recording failed attempt:", recordError);
    }

    return { success: false, error: "Failed to send email" };
  }
}
