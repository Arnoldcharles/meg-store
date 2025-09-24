import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      customer_name,
      customer_email,
      customer_address,
      customer_phone,
      customer_country,
      customer_state,
      order_items,
      total_amount,
    } = data;

    await sgMail.send({
      to: "arnoldcharles028@gmail.com",
      from: "arnoldcharles028@gmail.com",
      subject: `New Order from ${customer_name}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Name:</strong> ${customer_name}</p>
        <p><strong>Email:</strong> ${customer_email}</p>
        <p><strong>Phone:</strong> ${customer_phone}</p>
        <p><strong>Address:</strong> ${customer_address}, ${customer_state}, ${customer_country}</p>
        <p><strong>Order Items:</strong> ${order_items}</p>
        <p><strong>Total Amount:</strong> ₦${total_amount}</p>
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
