import nodemailer from "nodemailer";
import { config } from "@/lib/config";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

export async function sendMail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
    to,
    subject,
    html
  });
}
