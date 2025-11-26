import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();

    const post = await prisma.post.create({
        data: {
            title,
            content,
            published: true, // Auto-publish for now
            authorId: session.user.id,
        },
    });

    return NextResponse.json(post);
}
