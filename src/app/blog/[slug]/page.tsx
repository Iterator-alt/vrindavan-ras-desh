import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true } } },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
      <article style={{ background: 'white', padding: '3rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>{post.title}</h1>
        <p style={{ fontSize: '1rem', color: '#888', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          By {post.author.name || 'Admin'} | {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </article>
    </div>
  );
}
