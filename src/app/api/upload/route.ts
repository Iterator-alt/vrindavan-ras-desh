import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename || !request.body) {
            return NextResponse.json({ error: 'Filename and body are required' }, { status: 400 });
        }

        // Check if BLOB_READ_WRITE_TOKEN is set
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error('BLOB_READ_WRITE_TOKEN is not set');
            return NextResponse.json({
                error: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
            }, { status: 500 });
        }

        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload image: ' + (error.message || 'Unknown error')
        }, { status: 500 });
    }
}
