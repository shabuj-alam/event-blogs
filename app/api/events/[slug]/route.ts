import { NextRequest, NextResponse } from 'next/server';
import { connect } from 'mongoose';
import { Event } from '@/database';

// Ensure database connection
async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  await connect(process.env.MONGODB_URI);
}

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
      const { slug } =  await params;

    // Validate slug parameter
    if (!slug || slug.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Sanitize slug - only allow alphanumeric characters and hyphens
    const sanitizedSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/i.test(sanitizedSlug)) {
      return NextResponse.json(
        { error: 'Slug contains invalid characters' },
        { status: 400 }
      );
    }

      // Connect to database
      await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      { success: true, event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error('Error fetching event:', error);

    // Return generic error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
