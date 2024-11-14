'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/utils/supabase'

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  duration: number | null
  created_at: string
}

export default function VideoPlayer() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (user) {
      fetchVideos()
    }
  }, [user])

  const fetchVideos = async () => {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setVideos(data as Video[])
      if (data.length > 0) {
        setCurrentVideo(data[0])
      }
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-light-blue text-center p-4">
        No videos found. Start recording to create your first video!
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Main Video Player */}
      {currentVideo && (
        <div className="bg-navy-blue/20 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={currentVideo.url}
            className="w-full aspect-video"
            controls
            controlsList="nodownload"
            playsInline
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-light-blue">
              {currentVideo.title}
            </h2>
            {currentVideo.description && (
              <p className="text-goldenrod mt-2">
                {currentVideo.description}
              </p>
            )}
            <div className="flex justify-between items-center mt-2 text-sm text-light-blue/70">
              <span>{formatDate(currentVideo.created_at)}</span>
              <span>{formatDuration(currentVideo.duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setCurrentVideo(video)}
            className={`block w-full text-left rounded-lg overflow-hidden transition-all ${
              currentVideo?.id === video.id
                ? 'ring-2 ring-light-blue'
                : 'hover:ring-1 hover:ring-light-blue/50'
            }`}
          >
            <div className="aspect-video bg-navy-blue/30">
              <video
                src={video.url}
                className="w-full h-full object-cover"
                preload="metadata"
              />
            </div>
            <div className="p-2 bg-navy-blue/20">
              <h3 className="text-light-blue font-medium truncate">
                {video.title}
              </h3>
              <div className="flex justify-between items-center mt-1 text-xs text-light-blue/70">
                <span>{formatDate(video.created_at)}</span>
                <span>{formatDuration(video.duration)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 