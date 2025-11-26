import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <h1 className="section-title">Spiritual Blog</h1>
      <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No posts yet. Stay tuned!</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>{post.title}</Link>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                By {post.author.name || 'Admin'} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p style={{ lineHeight: '1.6', color: '#444' }}>
                {post.content.substring(0, 200)}...
              </p>
              <Link href={`/blog/${post.slug}`} style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                Read More &rarr;
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
