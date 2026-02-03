import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch donation settings
export async function GET() {
    try {
        const settings = await prisma.donationSettings.findUnique({
            where: { id: 'default' }
        })

        if (!settings) {
            return NextResponse.json(
                { error: 'Donation settings not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching donation settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch donation settings' },
            { status: 500 }
        )
    }
}

// PUT - Update donation settings (admin only)
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        const settings = await prisma.donationSettings.update({
            where: { id: 'default' },
            data: {
                donationPageUrl: data.donationPageUrl,
                sewaOptions: data.sewaOptions,
                pageTitle: data.pageTitle,
                pageSubtitle: data.pageSubtitle,
                pageDescription: data.pageDescription,
                heroImage: data.heroImage,
                isEnabled: data.isEnabled
            }
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error updating donation settings:', error)
        return NextResponse.json(
            { error: 'Failed to update donation settings' },
            { status: 500 }
        )
    }
}
