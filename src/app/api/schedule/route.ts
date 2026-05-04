import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const scheduleItems = await prisma.scheduleItem.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { time: 'asc' }
      ]
    })
    return NextResponse.json(scheduleItems)
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, time, day, category } = body

    if (!title || !time) {
      return NextResponse.json({ error: 'Title and time are required' }, { status: 400 })
    }

    const scheduleItem = await prisma.scheduleItem.create({
      data: {
        title,
        description,
        time,
        day: day || 'daily',
        category: category || 'aarti'
      }
    })

    return NextResponse.json(scheduleItem, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule item:', error)
    return NextResponse.json({ error: 'Failed to create schedule item' }, { status: 500 })
  }
}
