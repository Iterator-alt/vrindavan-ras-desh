import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // If it's just a status update from public checkout (payment confirmation), allow it
        // otherwise require admin auth
        const isPublicUpdate = Object.keys(body).length === 1 && body.paymentStatus === 'pending_verification';

        if (!isPublicUpdate) {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const order = await prisma.order.update({
            where: { id: params.id },
            data: body,
            include: {
                items: true
            }
        });

        // Send emails based on status change
        try {
            const { sendPaymentVerificationEmail, sendPaymentConfirmedEmail } = await import('@/lib/email');

            if (body.paymentStatus === 'pending_verification') {
                await sendPaymentVerificationEmail(order);
            } else if (body.paymentStatus === 'paid') {
                await sendPaymentConfirmedEmail(order);
            }
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.order.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
