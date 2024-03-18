import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const transporter = nodemailer.createTransport({
  name: "notification@visitktm.com",
  host: "mail.visitktm.com",
  port: 587,
  auth: {
    user: "notification@visitktm.com",
    pass: "Saisi@#$8854475",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

export const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, "../email"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../email"),
};
export const resetpw = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, "../email"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../email"),
};
