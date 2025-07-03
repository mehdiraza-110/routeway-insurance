import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, email, phone, Date, message } = await req.json();

  if (!name || !email || !Date || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
      const emailText = `
    📨 New Quick Request

    🧑 From:
    Name: ${name}
    Email: ${email}
    Phone: ${phone}

    📅 Policy Start Date:
    ${Date || 'Not provided'}
    `.trim();

    const t = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Quick Request from ${name}`,
      text: emailText,
    });

    console.log('Email sent:', t.response);


    // // send data to Google Sheets webhook
    // if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
    //   await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL!, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, message, Date }),
    //   });
    // }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
