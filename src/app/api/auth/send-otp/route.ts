import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in DB
        await prisma.oTP.create({
            data: {
                email,
                code: otp,
                expiresAt,
            },
        });

        // Send Email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        // Development Logger (if no SMTP)
        if (!process.env.EMAIL_SERVER_HOST) {
            console.log('--------------------------------');
            console.log(`🔐 DEVELOPMENT OTP for ${email}: ${otp}`);
            console.log('--------------------------------');
            return NextResponse.json({ success: true, message: 'OTP sent (Check Console)' });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Your Verification Code - Vrindavan Ras Desh',
            text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
            html: `<div style="font-family: sans-serif; padding: 20px;">
              <h2>Verification Code</h2>
              <p>Your code is: <strong style="font-size: 24px; color: #e74c3c;">${otp}</strong></p>
              <p>It expires in 10 minutes.</p>
             </div>`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
