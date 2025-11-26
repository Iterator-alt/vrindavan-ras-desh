import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    let settings = await prisma.siteSettings.findUnique({
        where: { id: 'default' },
    });

    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                id: 'default',
                heroTitle: 'Welcome to Vrindavan Ras Desh',
                heroSubtitle: 'Immerse yourself in the eternal divine love and spiritual bliss of Shri Vrindavan Dham.',
                heroImageUrl: 'https://images.unsplash.com/photo-1561583669-7c875954d72d?q=80&w=1920&auto=format&fit=crop',
            },
        });
    }

    return NextResponse.json(settings);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const settings = await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: data,
        create: {
            id: 'default',
            ...data,
        },
    });

    return NextResponse.json(settings);
}
