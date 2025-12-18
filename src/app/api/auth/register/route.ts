import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password, otp } = await req.json();

        if (!email || !password || !otp) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Verify OTP
        const validOtp = await prisma.oTP.findFirst({
            where: {
                email,
                code: otp,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!validOtp) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                emailVerified: new Date(),
            },
        });

        // Delete used OTPs
        await prisma.oTP.deleteMany({ where: { email } });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
