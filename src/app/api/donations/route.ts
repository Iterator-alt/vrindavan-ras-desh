import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      donationNumber,
      donorName,
      donorPhone,
      donorEmail,
      sevaTitle,
      sevaId,
      amount,
      transactionId
    } = body

    if (!donationNumber || !donorName || !donorPhone || !sevaTitle || !amount) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const donation = await prisma.donation.create({
      data: {
        donationNumber,
        donorName,
        donorPhone,
        donorEmail: donorEmail || null,
        sevaTitle,
        sevaId: sevaId || null,
        amount: parseFloat(amount),
        transactionId: transactionId || null,
        paymentStatus: 'pending'
      }
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
  }
}
