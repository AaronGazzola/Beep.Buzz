"use server";

import { Resend } from "resend";
import React from "react";
import { render } from "@react-email/render";
import ContactEmail from "@/emails/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmailAction({
  senderEmail,
  subject,
  message,
}: {
  senderEmail: string;
  subject: string;
  message: string;
}) {
  const html = await render(
    React.createElement(ContactEmail, { senderEmail, subject, message })
  );

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: process.env.CONTACT_EMAIL!,
    replyTo: senderEmail,
    subject: `Contact: ${subject}`,
    html,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send contact email");
  }

  return { success: true };
}
