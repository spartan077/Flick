'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'

interface VideoMetadata {
  id: string
  title: string
  description: string | null
  url: string
  duration: number | null
  created_at: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<VideoMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    try {
      if (!user?.id) return

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchVideos()
    }
  }, [user])

  useRealtimeUpdates({
    event: 'INSERT',
    table: 'videos',
    onData: (payload) => {
      if (payload.new.user_id === user?.id) {
        setVideos(prev => [payload.new, ...prev])
        // Add notification
        ;(window as any).addNotification?.('New video uploaded successfully!', 'success')
      }
    }
  })

  useRealtimeUpdates({
    event: 'DELETE',
    table: 'videos',
    onData: (payload) => {
      if (payload.old.user_id === user?.id) {
        setVideos(prev => prev.filter(video => video.id !== payload.old.id))
        // Add notification
        ;(window as any).addNotification?.('Video deleted', 'info')
      }
    }
  })

  const deleteVideo = async (videoId: string, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('videos')
        .remove([storagePath])

      if (storageError) throw storageError

      // Delete metadata
      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)

      if (dbError) throw dbError

      // Refresh video list
      await fetchVideos()
    } catch (err) {
      console.error('Error deleting video:', err)
      setError('Failed to delete video')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-blue"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-light-blue">Your Videos</h1>
          <Link href="/record" className="btn-primary">
            Record New Video
          </Link>
        </div>

        {error && (
          <div className="bg-red-100/10 text-red-400 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {videos.length === 0 ? (
          <div className="text-center py-12 bg-navy-blue/20 rounded-lg">
            <h2 className="text-xl text-light-blue mb-4">No videos yet</h2>
            <p className="text-goldenrod mb-6">Start recording to create your first video!</p>
            <Link href="/record" className="btn-primary">
              Record Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-navy-blue/20 rounded-lg overflow-hidden">
                <video
                  className="w-full aspect-video object-cover"
                  src={video.url}
                  controls
                  preload="metadata"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-light-blue mb-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-goldenrod text-sm mb-3">
                      {video.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-light-blue/70">
                      {new Date(video.created_at).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <a
                        href={video.url}
                        download
                        className="text-light-blue hover:text-bright-orange"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => deleteVideo(video.id, video.url)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 