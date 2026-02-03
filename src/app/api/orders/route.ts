import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/shop-utils';

// POST /api/orders - Create new order
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingPincode,
            items,
            subtotal,
            tax,
            shipping,
            total,
            notes,
        } = body;

        // Validate required fields
        if (
            !customerName ||
            !customerEmail ||
            !customerPhone ||
            !shippingAddress ||
            !shippingCity ||
            !shippingState ||
            !shippingPincode ||
            !items ||
            items.length === 0
        ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate unique order number
        const orderNumber = generateOrderNumber();

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                shippingCity,
                shippingState,
                shippingPincode,
                subtotal,
                tax,
                shipping,
                total,
                notes,
                status: 'pending',
                paymentStatus: 'pending',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Send confirmation email
        try {
            const { sendOrderReceivedEmail } = await import('@/lib/email');
            await sendOrderReceivedEmail(order);
        } catch (emailError) {
            console.error('Failed to send order email:', emailError);
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

// GET /api/orders - List all orders (admin only)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const orders = await prisma.order.findMany({
            where: {
                ...(status && { status }),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
