import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/shop-utils';

// GET /api/products/[id] - Get single product
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            description,
            price,
            compareAtPrice,
            images,
            categoryId,
            stock,
            isActive,
            featured,
        } = body;

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Generate new slug if name changed
        let slug = existingProduct.slug;
        if (name && name !== existingProduct.name) {
            slug = generateSlug(name);

            // Check if new slug conflicts with another product
            const slugConflict = await prisma.product.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });

            if (slugConflict) {
                return NextResponse.json(
                    { error: 'A product with this name already exists' },
                    { status: 400 }
                );
            }
        }

        // Update product
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name && { name, slug }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(compareAtPrice !== undefined && {
                    compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                }),
                ...(images !== undefined && { images }),
                ...(categoryId && { categoryId }),
                ...(stock !== undefined && { stock: parseInt(stock) }),
                ...(isActive !== undefined && { isActive }),
                ...(featured !== undefined && { featured }),
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Delete product
        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
