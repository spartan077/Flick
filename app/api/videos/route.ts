import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { withRateLimit } from '@/utils/rateLimiter'

async function handleRequest(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Please sign in to continue' },
        { status: 401 }
      )
    }

    if (request.method === 'POST') {
      // Get request body
      const body = await request.json()
      const { title, description, url, storagePath, duration } = body

      // Validate required fields
      if (!title || !url || !storagePath) {
        return NextResponse.json(
          { error: 'Please provide all required information' },
          { status: 400 }
        )
      }

      // Save video metadata
      const { data, error } = await supabase
        .from('videos')
        .insert({
          user_id: session.user.id,
          title,
          description,
          url,
          storage_path: storagePath,
          duration,
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        await logError(supabase, 'video_save_error', error, session.user.id)
        return NextResponse.json(
          { error: 'Failed to save video information. Please try again.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Video saved successfully',
        data
      })
    }

    if (request.method === 'GET') {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        await logError(supabase, 'video_fetch_error', error, session.user.id)
        return NextResponse.json(
          { error: 'Failed to fetch videos. Please try again.' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

async function logError(
  supabase: any,
  type: string,
  error: any,
  userId: string
) {
  try {
    await supabase
      .from('error_logs')
      .insert({
        user_id: userId,
        error_type: type,
        error_message: error.message,
        error_details: JSON.stringify(error),
        created_at: new Date().toISOString(),
      })
  } catch (logError) {
    console.error('Error logging failed:', logError)
  }
}

export const POST = (req: Request) => withRateLimit(req, handleRequest)
export const GET = (req: Request) => withRateLimit(req, handleRequest) 