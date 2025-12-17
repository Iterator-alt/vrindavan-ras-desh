import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, calculateDiscount } from '@/lib/shop-utils';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
          <Link href="/" style={{ color: 'var(--primary-color)' }}>Home</Link>
          {' / '}
          <Link href="/shop" style={{ color: 'var(--primary-color)' }}>Shop</Link>
          {' / '}
          <Link href={`/shop?category=${product.category.slug}`} style={{ color: 'var(--primary-color)' }}>
            {product.category.name}
          </Link>
          {' / '}
          <span>{product.name}</span>
        </div>

        {/* Product Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          {/* Product Images */}
          <div>
            <div
              style={{
                position: 'relative',
                paddingTop: '100%',
                background: '#f5f5f5',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
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
                  <i className="fas fa-image" style={{ fontSize: '5rem' }}></i>
                </div>
              )}
              {discount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: '#e74c3c',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '700',
                  }}
                >
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #ddd',
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>
              {product.category.name}
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span
                      style={{
                        fontSize: '1.5rem',
                        color: '#999',
                        textDecoration: 'line-through',
                      }}
                    >
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      Save {formatPrice(product.compareAtPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Inclusive of all taxes
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Description</h3>
              <p style={{ lineHeight: '1.8', color: '#666' }}>{product.description}</p>
            </div>

            {/* Stock Status */}
            <div style={{ marginBottom: '2rem' }}>
              {product.stock > 0 ? (
                <div style={{ fontSize: '1rem', color: '#27ae60', fontWeight: '600' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div style={{ fontSize: '1rem', color: '#e74c3c', fontWeight: '600' }}>
                  <i className="fas fa-times-circle" style={{ marginRight: '8px' }}></i>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Features */}
            <div
              style={{
                marginTop: '3rem',
                padding: '1.5rem',
                background: '#f9f9f9',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <i className="fas fa-truck" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                  <div>
                    <div style={{ fontWeight: '600' }}>Free Shipping</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>On orders above ₹500</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                  <div>
                    <div style={{ fontWeight: '600' }}>Secure Payment</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>100% secure transactions</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <i className="fas fa-undo" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                  <div>
                    <div style={{ fontWeight: '600' }}>Easy Returns</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>7-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title">Related Products</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem',
              }}
            >
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.slug}`}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
                    {relatedProduct.images[0] && (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{relatedProduct.name}</h4>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                      {formatPrice(relatedProduct.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
