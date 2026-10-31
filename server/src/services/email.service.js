
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const requiredEnv = [
    "BREVO_SMTP_HOST",
    "BREVO_SMTP_PORT",
    "BREVO_SMTP_USER",
    "BREVO_SMTP_KEY",
    "EMAIL_FROM",
];

for (const key of requiredEnv) {
    if (!env[key]) {
        throw new Error(`Missing required email configuration: ${key}`);
    }
}

const port = Number(env.BREVO_SMTP_PORT);

if (!Number.isInteger(port) || port <= 0) {
    throw new Error("BREVO_SMTP_PORT must be a valid port number");
}

const transporter = nodemailer.createTransport({
    host: env.BREVO_SMTP_HOST,
    port: env.BREVO_SMTP_PORT,
    secure: env.BREVO_SMTP_PORT === 465,
    auth: {
        user: env.BREVO_SMTP_USER,
        pass: env.BREVO_SMTP_KEY,
    },
});

export async function sendEmail({ to, subject, text, html }) {
    if (!to || !subject || (!text && !html)) {
        throw new Error("Recipient, subject, and email content are required");
    }

    return transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
    });
}

export async function sendVerificationEmail({ to, code }) {
    return sendEmail({
        to,
        subject: `NexTalk verification code`,

        text: [
            "NexTalk",
            "Your space. Your people.",
            "",
            "ONE LAST STEP.",
            "",
            "Welcome to NexTalk.",
            "Use the verification code below to verify your email address:",
            "",
            code,
            "",
            "This code expires in 5 minutes.",
            "",
            "If you did not request this code, you can safely ignore this email.",
            "Never share your verification code with anyone.",
            "",
            "NexTalk — A little closer, wherever you are.",
        ].join("\n"),

        html: `
    <div style="margin:0;padding:36px 16px;background-color:#171815;font-family:Arial,Helvetica,sans-serif;color:#22231F;">
      <div style="max-width:520px;margin:0 auto;">

        <!-- Brand header -->
        <div style="padding:0 4px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:40px;height:40px;background-color:#D9DDC7;border-radius:10px;text-align:center;vertical-align:middle;font-size:23px;font-weight:bold;color:#22231F;">
                N
              </td>
              <td style="padding-left:12px;vertical-align:middle;">
                <div style="font-size:21px;font-weight:700;letter-spacing:-0.5px;color:#F2F0E8;">
                  NexTalk
                </div>
                <div style="padding-top:3px;font-size:10px;letter-spacing:2px;color:#A5A694;">
                  YOUR SPACE. YOUR PEOPLE.
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Main card -->
        <div style="background-color:#F2F0E8;border-radius:16px;overflow:hidden;">

          <div style="padding:36px 28px 32px;">

            <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#777A62;">
              EMAIL VERIFICATION / 001
            </div>

            <h1 style="margin:18px 0 12px;font-size:34px;line-height:1.15;letter-spacing:-1.2px;color:#22231F;">
              One last step.
            </h1>

            <p style="margin:0;font-size:15px;line-height:1.8;color:#55564D;">
              Welcome to NexTalk. Verify your email address to finish setting up your account and get connected.
            </p>

            <!-- OTP panel -->
            <div style="margin-top:28px;padding:26px 16px;background-color:#E7E7DA;border:1px solid #D8D8C9;border-radius:12px;text-align:center;">

              <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#686A59;">
                YOUR VERIFICATION CODE
              </div>

              <div style="margin:18px 0;font-family:Arial,Helvetica,sans-serif;font-size:34px;line-height:1.3;font-weight:700;letter-spacing:7px;color:#22231F;white-space:nowrap;">
                ${escapeHtml(code)}
              </div>

              <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:#777A62;">
                EXPIRES IN 5 MINUTES
              </div>
            </div>

            <p style="margin:24px 0 0;font-size:14px;line-height:1.8;color:#55564D;">
              Enter this code on the verification screen to confirm that this email address belongs to you.
            </p>

            <div style="height:1px;margin:28px 0 20px;background-color:#D8D6CA;"></div>

            <p style="margin:0;font-size:12px;line-height:1.8;color:#777A62;">
              <strong style="color:#55564D;">Didn't request this?</strong>
              You can safely ignore this email. Never share your verification code with anyone.
            </p>

          </div>
        </div>

        <!-- Footer -->
        <div style="padding:26px 12px 8px;text-align:center;">
          <div style="font-size:14px;font-weight:700;letter-spacing:0.5px;color:#F2F0E8;">
            NexTalk
          </div>
          <div style="margin-top:8px;font-size:12px;line-height:1.7;color:#A5A694;">
            A little closer, wherever you are.
          </div>
          <div style="margin-top:18px;font-size:10px;line-height:1.6;color:#777A62;">
            AUTOMATED SECURITY EMAIL · PLEASE DO NOT REPLY
          </div>
        </div>

      </div>
    </div>
  `,
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}
