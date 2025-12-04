'use client';

import { InstagramEmbed } from 'react-social-media-embed';

export default function InstagramPosts({ post1, post2, post3 }: { post1?: string | null, post2?: string | null, post3?: string | null }) {
  const hasPosts = post1 || post2 || post3;

  if (!hasPosts) {
    return <p>No Instagram posts configured yet.</p>;
  }

  return (
    <>
      {post1 && (
        <div style={{ width: '328px' }}>
          <InstagramEmbed url={post1} width={328} />
        </div>
      )}
      {post2 && (
        <div style={{ width: '328px' }}>
          <InstagramEmbed url={post2} width={328} />
        </div>
      )}
      {post3 && (
        <div style={{ width: '328px' }}>
          <InstagramEmbed url={post3} width={328} />
        </div>
      )}
    </>
  );
}
