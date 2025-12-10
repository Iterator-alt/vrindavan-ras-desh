import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'admin@vrindavan.com' },
        update: {},
        create: {
            email: 'admin@vrindavan.com',
            name: 'Super Admin',
            password,
            role: 'SUPERADMIN',
        },
    })

    console.log({ user })

    // Seed default categories for the store
    const categories = [
        { name: 'Books', slug: 'books', description: 'Spiritual books and scriptures' },
        { name: 'Idols & Murtis', slug: 'idols-murtis', description: 'Sacred idols and deity murtis' },
        { name: 'Puja Items', slug: 'puja-items', description: 'Items for worship and puja' },
        { name: 'Prasadam', slug: 'prasadam', description: 'Sacred food offerings' },
        { name: 'Clothing', slug: 'clothing', description: 'Traditional spiritual clothing' },
        { name: 'Audio & Video', slug: 'audio-video', description: 'Bhajans, kirtans, and spiritual videos' },
    ]

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
    }

    console.log('Seeded categories:', categories.length)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
