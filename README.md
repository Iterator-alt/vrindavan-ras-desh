# Vrindavan Ras Desh 🕉️

A beautiful, dynamic website for the Vrindavan Ras Desh YouTube channel. Built with Next.js, featuring a blog system, admin dashboard, and content management.

## Features

- 🎨 Premium spiritual design with saffron & gold theme
- 📝 Blog system for spiritual articles
- 🎥 Video gallery integration
- 👤 Admin dashboard with authentication
- ⚙️ Site settings CMS (change hero, videos, etc.)
- 📱 Fully responsive

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL (Vercel Postgres)
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Styling**: Vanilla CSS

## Getting Started Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (copy from `.env.example`)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Default Admin Login

- Email: `admin@vrindavan.com`
- Password: `admin123`

⚠️ **Change this password after first login!**

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   └── lib/              # Utility functions & Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
└── public/               # Static assets
```

## License

All Rights Reserved © 2024 Vrindavan Ras Desh
