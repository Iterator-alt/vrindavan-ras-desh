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

    // Seed default donation settings
    const defaultSewaOptions = [
        {
            id: 'pangat-500',
            title: 'Pangat Sewa',
            description: 'Feed prasadam to 500 devotees',
            amount: 5000,
            icon: '🍽️',
            image: '',
            isActive: true
        },
        {
            id: 'dress-sewa',
            title: 'Dress Sewa',
            description: 'Offer a beautiful dress to Radha Vallabh Lal',
            amount: 2100,
            icon: '👗',
            image: '',
            isActive: true
        },
        {
            id: 'bhog-sewa',
            title: 'Bhog Sewa',
            description: 'Offer special bhog to the divine couple',
            amount: 1100,
            icon: '🌺',
            image: '',
            isActive: true
        },
        {
            id: 'temple-maintenance',
            title: 'Temple Maintenance',
            description: 'Support daily temple upkeep and maintenance',
            amount: 3000,
            icon: '🏛️',
            image: '',
            isActive: true
        }
    ]

    await prisma.donationSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            pageTitle: 'Support Our Seva',
            pageSubtitle: 'Contribute to the divine service of Radha Vallabh Lal',
            pageDescription: 'Your generous contribution helps us serve thousands of devotees and maintain the sacred temple.',
            sewaOptions: defaultSewaOptions,
            isEnabled: true
        }
    })

    console.log('Seeded donation settings with', defaultSewaOptions.length, 'seva options')
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
