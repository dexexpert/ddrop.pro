import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY");
}
if (!fromAddress) {
  throw new Error("Missing RESEND_FROM");
}

const resend = new Resend(resendApiKey);

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  return resend.emails.send({
    from: fromAddress,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};
