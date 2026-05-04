import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    // Create admin user
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

    console.log('Created admin user:', user.email)

    // Seed categories with working placeholder images
    const categories = [
        { name: 'Books', slug: 'books', description: 'Spiritual books and scriptures', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop' },
        { name: 'Idols & Murtis', slug: 'idols-murtis', description: 'Sacred idols and deity murtis', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop' },
        { name: 'Puja Items', slug: 'puja-items', description: 'Items for worship and puja', image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=400&h=400&fit=crop' },
        { name: 'Prasadam', slug: 'prasadam', description: 'Sacred food offerings', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop' },
        { name: 'Clothing', slug: 'clothing', description: 'Traditional spiritual clothing', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop' },
        { name: 'Audio & Video', slug: 'audio-video', description: 'Bhajans, kirtans, and spiritual videos', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop' },
    ]

    const categoryMap: Record<string, string> = {}
    for (const category of categories) {
        const created = await prisma.category.upsert({
            where: { slug: category.slug },
            update: { image: category.image },
            create: category,
        })
        categoryMap[category.slug] = created.id
    }
    console.log('Seeded categories:', categories.length)

    // Seed products with working images
    const products = [
        {
            name: 'Bhagavad Gita As It Is',
            slug: 'bhagavad-gita-as-it-is',
            description: 'The timeless classic with original Sanskrit text, Roman transliteration, English equivalents, translation and elaborate purports by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.',
            price: 350,
            compareAtPrice: 450,
            images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop'],
            categoryId: categoryMap['books'],
            stock: 50,
            isActive: true,
            featured: true,
        },
        {
            name: 'Srimad Bhagavatam Set (18 Volumes)',
            slug: 'srimad-bhagavatam-set',
            description: 'Complete set of Srimad Bhagavatam with original Sanskrit, transliteration, word-for-word meanings, translations and elaborate purports.',
            price: 8500,
            compareAtPrice: 10000,
            images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop'],
            categoryId: categoryMap['books'],
            stock: 15,
            isActive: true,
            featured: true,
        },
        {
            name: 'Brass Krishna Murti (12 inch)',
            slug: 'brass-krishna-murti-12inch',
            description: 'Beautiful handcrafted brass murti of Lord Krishna playing the flute. Perfect for home altar and temple worship.',
            price: 4500,
            compareAtPrice: 5500,
            images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop'],
            categoryId: categoryMap['idols-murtis'],
            stock: 10,
            isActive: true,
            featured: true,
        },
        {
            name: 'Radha Krishna Marble Murti Set',
            slug: 'radha-krishna-marble-murti',
            description: 'Exquisite white marble Radha Krishna murti set, hand-painted with vibrant colors. Height: 18 inches.',
            price: 12000,
            compareAtPrice: 15000,
            images: ['https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop'],
            categoryId: categoryMap['idols-murtis'],
            stock: 5,
            isActive: true,
            featured: false,
        },
        {
            name: 'Pure Copper Puja Thali Set',
            slug: 'copper-puja-thali-set',
            description: 'Complete puja thali set made of pure copper. Includes thali, diya, bell, incense holder, and small containers.',
            price: 1800,
            compareAtPrice: 2200,
            images: ['https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop'],
            categoryId: categoryMap['puja-items'],
            stock: 25,
            isActive: true,
            featured: false,
        },
        {
            name: 'Sandalwood Japa Mala (108 beads)',
            slug: 'sandalwood-japa-mala',
            description: 'Premium sandalwood japa mala with 108 beads for chanting. Comes with a beautiful mala bag.',
            price: 650,
            compareAtPrice: 800,
            images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'],
            categoryId: categoryMap['puja-items'],
            stock: 100,
            isActive: true,
            featured: true,
        },
        {
            name: 'Tulsi Mala (Kanthi)',
            slug: 'tulsi-kanthi-mala',
            description: 'Sacred Tulsi neck beads worn by devotees. Set of 2 strands - small and medium size.',
            price: 150,
            compareAtPrice: 200,
            images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'],
            categoryId: categoryMap['puja-items'],
            stock: 200,
            isActive: true,
            featured: false,
        },
        {
            name: 'Vrindavan Peda (500g)',
            slug: 'vrindavan-peda-500g',
            description: 'Authentic Vrindavan peda made with pure ghee and milk. Temple prasadam quality.',
            price: 450,
            compareAtPrice: null,
            images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop'],
            categoryId: categoryMap['prasadam'],
            stock: 30,
            isActive: true,
            featured: false,
        },
        {
            name: 'Mathura Puri & Ghee',
            slug: 'mathura-puri-ghee',
            description: 'Traditional Mathura puri packed with pure desi ghee. Perfect for offering to the Lord.',
            price: 350,
            compareAtPrice: null,
            images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop'],
            categoryId: categoryMap['prasadam'],
            stock: 20,
            isActive: true,
            featured: false,
        },
        {
            name: 'Cotton Dhoti & Kurta Set (White)',
            slug: 'cotton-dhoti-kurta-white',
            description: 'Pure white cotton dhoti and kurta set for temple wear. Comfortable and traditional.',
            price: 1200,
            compareAtPrice: 1500,
            images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop'],
            categoryId: categoryMap['clothing'],
            stock: 40,
            isActive: true,
            featured: false,
        },
        {
            name: 'Silk Sari (Temple Collection)',
            slug: 'silk-sari-temple',
            description: 'Beautiful silk sari from our temple collection. Perfect for festivals and special occasions.',
            price: 3500,
            compareAtPrice: 4500,
            images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop'],
            categoryId: categoryMap['clothing'],
            stock: 15,
            isActive: true,
            featured: false,
        },
        {
            name: 'Kirtan Bhajan Collection (USB)',
            slug: 'kirtan-bhajan-usb',
            description: 'Collection of 500+ devotional bhajans and kirtans in high quality audio format on USB drive.',
            price: 500,
            compareAtPrice: 750,
            images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop'],
            categoryId: categoryMap['audio-video'],
            stock: 50,
            isActive: true,
            featured: false,
        },
    ]

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: { images: product.images },
            create: product,
        })
    }
    console.log('Seeded products:', products.length)

    // Seed blog posts
    const posts = [
        {
            title: 'The Significance of Radha Vallabh Temple',
            slug: 'significance-of-radha-vallabh-temple',
            content: `<h2>A Sacred Heritage</h2>
<p>The Radha Vallabh Temple in Vrindavan is one of the most sacred temples dedicated to the divine love of Radha and Krishna. Founded in the 16th century, this temple holds a unique position in the Vaishnava tradition.</p>

<h2>The Divine Deity</h2>
<p>What makes this temple truly special is that here, unlike other temples, Radharani is worshipped as the primary deity. The name "Radha Vallabh" itself means "the beloved of Radha," signifying Krishna's eternal devotion to Radharani.</p>

<h2>Architectural Marvel</h2>
<p>The temple showcases exquisite Rajasthani architecture with intricate carvings and beautiful artwork depicting the divine pastimes of Radha and Krishna.</p>

<h2>Daily Seva</h2>
<p>The temple maintains a rigorous schedule of daily worship including mangala arati, shringar arati, raj bhog, and sandhya arati. Devotees from around the world come to participate in these divine services.</p>`,
            published: true,
            authorId: user.id,
        },
        {
            title: 'Understanding the Importance of Seva',
            slug: 'importance-of-seva',
            content: `<h2>What is Seva?</h2>
<p>Seva, or selfless service, is one of the most important aspects of devotional life. It is the act of serving the Lord, His devotees, and His creation without any expectation of reward.</p>

<h2>Types of Seva</h2>
<p>There are many ways to perform seva:</p>
<ul>
<li><strong>Deity Seva:</strong> Directly serving the temple deities through cleaning, decorating, and offering food.</li>
<li><strong>Kitchen Seva:</strong> Preparing prasadam for devotees and visitors.</li>
<li><strong>Temple Maintenance:</strong> Keeping the temple premises clean and beautiful.</li>
<li><strong>Book Distribution:</strong> Sharing spiritual knowledge with others.</li>
</ul>

<h2>Benefits of Seva</h2>
<p>When we engage in seva, our hearts become purified. We develop humility, patience, and love for the Lord. Seva is not just an activity; it is a way of life that transforms our consciousness.</p>`,
            published: true,
            authorId: user.id,
        },
        {
            title: 'Celebrating Janmashtami at Vrindavan',
            slug: 'janmashtami-vrindavan',
            content: `<h2>The Most Auspicious Day</h2>
<p>Janmashtami, the appearance day of Lord Krishna, is celebrated with great fervor in Vrindavan. The entire town comes alive with devotion, music, and festivities.</p>

<h2>Temple Celebrations</h2>
<p>At Radha Vallabh Temple, the celebrations begin days in advance. The temple is decorated with flowers and lights, and special bhog offerings are prepared for the Lord.</p>

<h2>Midnight Celebrations</h2>
<p>Lord Krishna appeared at midnight, and so the celebrations reach their peak at this time. The temple resonates with the sound of conch shells, bells, and devotional songs as devotees welcome the Lord's appearance.</p>

<h2>Join Us This Year</h2>
<p>We invite all devotees to join us for this year's Janmashtami celebrations. Experience the divine atmosphere of Vrindavan and receive the blessings of Radha Vallabh Lal.</p>`,
            published: true,
            authorId: user.id,
        },
    ]

    for (const post of posts) {
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: post,
        })
    }
    console.log('Seeded blog posts:', posts.length)

    // Seed events with working images
    const events = [
        {
            title: 'Sunday Feast Program',
            description: 'Join us every Sunday for kirtan, class, and delicious prasadam feast. Open to all.',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            location: 'Temple Hall',
            imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
            isActive: true,
        },
        {
            title: 'Ekadashi Kirtan Mela',
            description: 'Special 6-hour kirtan program on the auspicious day of Ekadashi. Fasting prasadam will be served.',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            location: 'Main Temple',
            imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
            isActive: true,
        },
        {
            title: 'Holi Festival Celebration',
            description: 'Experience the divine colors of Holi at our temple. Natural colors, kirtan, and special prasadam.',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            location: 'Temple Courtyard',
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop',
            isActive: true,
        },
    ]

    // Delete old events and create new ones
    await prisma.event.deleteMany({})
    for (const event of events) {
        await prisma.event.create({ data: event })
    }
    console.log('Seeded events:', events.length)

    // Seed site settings with working images and embed video URLs
    await prisma.siteSettings.upsert({
        where: { id: 'default' },
        update: {
            heroImages: [
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
            ],
            videoUrl1: 'https://www.youtube.com/embed/LXb3EKWsInQ',
            videoUrl2: 'https://www.youtube.com/embed/LXb3EKWsInQ',
            videoUrl3: 'https://www.youtube.com/embed/LXb3EKWsInQ',
        },
        create: {
            id: 'default',
            heroTitle: 'Radha Vallabh Lal Ki Jai',
            heroSubtitle: 'Experience Divine Love at Vrindavan',
            heroImages: [
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
            ],
            contactEmail: 'info@vrindavan-rasdesh.com',
            contactPhone: '+91 98765 43210',
            instagramUrl: 'https://instagram.com/vrindavanrasdesh',
            youtubeUrl: 'https://youtube.com/@vrindavanrasdesh',
            facebookUrl: 'https://facebook.com/vrindavanrasdesh',
            videoUrl1: 'https://www.youtube.com/embed/LXb3EKWsInQ',
            videoTitle1: 'Morning Arati',
            videoUrl2: 'https://www.youtube.com/embed/LXb3EKWsInQ',
            videoTitle2: 'Evening Kirtan',
            videoUrl3: 'https://www.youtube.com/embed/LXb3EKWsInQ',
            videoTitle3: 'Temple Tour',
            upiId: 'vrindavan@upi',
            paymentInstructions: 'Scan the QR code or use UPI ID to make payment. After payment, please share the transaction ID.',
        },
    })
    console.log('Seeded site settings')

    // Seed donation settings with images
    const defaultSewaOptions = [
        {
            id: 'pangat-500',
            title: 'Pangat Sewa',
            description: 'Feed prasadam to 500 devotees',
            amount: 5000,
            icon: '🍽️',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
            isActive: true
        },
        {
            id: 'dress-sewa',
            title: 'Dress Sewa',
            description: 'Offer a beautiful dress to Radha Vallabh Lal',
            amount: 2100,
            icon: '👗',
            image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop',
            isActive: true
        },
        {
            id: 'bhog-sewa',
            title: 'Bhog Sewa',
            description: 'Offer special bhog to the divine couple',
            amount: 1100,
            icon: '🌺',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            isActive: true
        },
        {
            id: 'temple-maintenance',
            title: 'Temple Maintenance',
            description: 'Support daily temple upkeep and maintenance',
            amount: 3000,
            icon: '🏛️',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
            isActive: true
        },
        {
            id: 'gau-seva',
            title: 'Gau Seva',
            description: 'Feed and care for sacred cows at the goshala',
            amount: 1500,
            icon: '🐄',
            image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&h=300&fit=crop',
            isActive: true
        },
        {
            id: 'flower-seva',
            title: 'Flower Seva',
            description: 'Provide fresh flowers for daily deity worship',
            amount: 500,
            icon: '🌸',
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
            isActive: true
        }
    ]

    await prisma.donationSettings.upsert({
        where: { id: 'default' },
        update: {
            sewaOptions: defaultSewaOptions,
            heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop',
        },
        create: {
            id: 'default',
            pageTitle: 'Support Our Divine Seva',
            pageSubtitle: 'Contribute to the loving service of Radha Vallabh Lal',
            pageDescription: 'Your generous contribution helps us serve thousands of devotees daily, maintain the sacred temple, and spread the message of divine love. Every donation, big or small, makes a difference.',
            heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop',
            sewaOptions: defaultSewaOptions,
            isEnabled: true
        }
    })

    console.log('Seeded donation settings with', defaultSewaOptions.length, 'seva options')
    console.log('\n✅ Database seeding completed successfully!')
    console.log('\n📝 Admin login credentials:')
    console.log('   Email: admin@vrindavan.com')
    console.log('   Password: admin123')
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
