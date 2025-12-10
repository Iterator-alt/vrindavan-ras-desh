import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/shop-utils';

// GET /api/products - List all products (public) or with filters (admin)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const featured = searchParams.get('featured');
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const session = await getServerSession(authOptions);
        const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN';

        const products = await prisma.product.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(featured && { featured: featured === 'true' }),
                ...(!includeInactive && !isAdmin && { isActive: true }),
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: Request) {
    try {
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

        // Validate required fields
        if (!name || !description || !price || !categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields: name, description, price, categoryId' },
                { status: 400 }
            );
        }

        // Generate slug from name
        const slug = generateSlug(name);

        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });

        if (existingProduct) {
            return NextResponse.json(
                { error: 'A product with this name already exists' },
                { status: 400 }
            );
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                images: images || [],
                categoryId,
                stock: stock ? parseInt(stock) : 0,
                isActive: isActive !== undefined ? isActive : true,
                featured: featured || false,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
