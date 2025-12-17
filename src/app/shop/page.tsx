import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, calculateDiscount } from '@/lib/shop-utils';

export const revalidate = 60; // Revalidate every minute

interface SearchParams {
  category?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category: categorySlug } = await searchParams;

  // Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // Fetch products
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug && {
        category: {
          slug: categorySlug,
        },
      }),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const selectedCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">Our Shop</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Discover spiritual items, books, and offerings for your devotional journey
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/shop"
              style={{
                padding: '10px 24px',
                borderRadius: '25px',
                background: !categorySlug ? 'var(--primary-color)' : '#f0f0f0',
                color: !categorySlug ? 'white' : '#333',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
              }}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                style={{
                  padding: '10px 24px',
                  borderRadius: '25px',
                  background: categorySlug === category.slug ? 'var(--primary-color)' : '#f0f0f0',
                  color: categorySlug === category.slug ? 'white' : '#333',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Count */}
        <div style={{ marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
          {selectedCategory ? (
            <p>
              Showing {products.length} {products.length === 1 ? 'product' : 'products'} in{' '}
              <strong>{selectedCategory.name}</strong>
            </p>
          ) : (
            <p>
              Showing all {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <i className="fas fa-box-open" style={{ fontSize: '4rem', color: '#ddd', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No products found</h3>
            <p style={{ color: '#999' }}>
              {selectedCategory
                ? `No products available in ${selectedCategory.name} category yet.`
                : 'No products available yet. Check back soon!'}
            </p>
            {selectedCategory && (
              <Link href="/shop" className="cta-button" style={{ marginTop: '2rem', display: 'inline-block' }}>
                View All Products
              </Link>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {products.map((product) => {
              const discount = product.compareAtPrice
                ? calculateDiscount(product.price, product.compareAtPrice)
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="product-card"
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                  }}
                >
                  {/* Product Image */}
                  <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ccc',
                        }}
                      >
                        <i className="fas fa-image" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#e74c3c',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                        }}
                      >
                        {discount}% OFF
                      </div>
                    )}
                    {/* Featured Badge */}
                    {product.featured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'var(--secondary-color)',
                          color: '#333',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                        }}
                      >
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>
                      {product.category.name}
                    </div>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        marginBottom: '0.75rem',
                        color: '#333',
                        fontWeight: '600',
                        lineHeight: '1.4',
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '1rem',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span
                          style={{
                            fontSize: '1rem',
                            color: '#999',
                            textDecoration: 'line-through',
                          }}
                        >
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#27ae60', fontWeight: '600' }}>
                        <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                        In Stock ({product.stock} available)
                      </div>
                    ) : (
                      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#e74c3c', fontWeight: '600' }}>
                        <i className="fas fa-times-circle" style={{ marginRight: '6px' }}></i>
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
