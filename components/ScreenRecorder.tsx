'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/utils/supabase'

interface RecordingState {
  status: 'idle' | 'recording' | 'paused' | 'stopped'
  startTime?: number
  duration: number
}

interface VideoMetadata {
  id: string
  title: string
  description: string | null
  url: string
  duration: number | null
  created_at: string
}

export default function ScreenRecorder() {
  const { user } = useAuth()
  const [recordingState, setRecordingState] = useState<RecordingState>({
    status: 'idle',
    duration: 0,
  })
  const [error, setError] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [videos, setVideos] = useState<VideoMetadata[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout>()

  // Fetch existing videos on component mount
  useEffect(() => {
    if (user) {
      fetchVideos()
    }
  }, [user])

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('videos')
        .list(`${user?.id}/`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) throw error

      const videoFiles: VideoMetadata[] = await Promise.all(
        data.map(async (file) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('videos')
            .getPublicUrl(`${user?.id}/${file.name}`)

          return {
            id: file.id,
            title: file.name,
            description: null,
            url: publicUrl,
            duration: null,
            created_at: file.created_at,
          }
        })
      )

      setVideos(videoFiles)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to fetch videos')
    }
  }

  const updateDuration = useCallback(() => {
    if (recordingState.startTime) {
      setRecordingState(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - prev.startTime!) / 1000),
      }))
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 30,
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        streamRef.current?.getTracks().forEach(track => track.stop())
        clearInterval(timerRef.current)
      }

      mediaRecorder.start(200)
      setRecordingState({
        status: 'recording',
        startTime: Date.now(),
        duration: 0,
      })

      timerRef.current = setInterval(updateDuration, 1000)
    } catch (err) {
      setError('Failed to start recording')
      console.error(err)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState.status === 'recording') {
      mediaRecorderRef.current.pause()
      clearInterval(timerRef.current)
      setRecordingState(prev => ({ ...prev, status: 'paused' }))
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState.status === 'paused') {
      mediaRecorderRef.current.resume()
      timerRef.current = setInterval(updateDuration, 1000)
      setRecordingState(prev => ({ ...prev, status: 'recording' }))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecordingState(prev => ({ ...prev, status: 'stopped' }))
    }
  }

  const uploadRecording = async () => {
    if (chunksRef.current.length === 0 || !user) return

    const blob = new Blob(chunksRef.current, { type: 'video/webm' })
    const file = new File([blob], `screen-recording-${Date.now()}.webm`, {
      type: 'video/webm',
    })

    try {
      setUploading(true)
      setUploadProgress(0)

      // Upload file to storage
      const filePath = `${user.id}/${file.name}`
      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath)

      // Save metadata
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || 'Untitled Recording',
          description,
          url: publicUrl,
          storagePath: filePath,
          duration: recordingState.duration,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save video metadata')
      }

      // Reset state
      chunksRef.current = []
      setRecordingState({
        status: 'idle',
        duration: 0,
      })
      setTitle('')
      setDescription('')
      await fetchVideos()
    } catch (err) {
      setError('Failed to upload recording')
      console.error(err)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteVideo = async (videoName: string) => {
    try {
      const { error } = await supabase
        .storage
        .from('videos')
        .remove([`${user?.id}/${videoName}`])

      if (error) throw error

      await fetchVideos()
    } catch (err) {
      console.error('Error deleting video:', err)
      setError('Failed to delete video')
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-4xl space-y-8 bg-navy-blue/20 p-6 rounded-lg backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-light-blue">Screen Recorder</h2>
        {recordingState.status !== 'idle' && (
          <p className="text-goldenrod mt-2">
            Duration: {formatDuration(recordingState.duration)}
          </p>
        )}
      </div>

      {error && (
        <div className="text-red-500 bg-red-100/10 p-2 rounded text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        {recordingState.status === 'idle' && (
          <button
            onClick={startRecording}
            className="btn-primary"
          >
            Start Recording
          </button>
        )}

        {recordingState.status === 'recording' && (
          <>
            <button
              onClick={pauseRecording}
              className="btn-primary"
            >
              Pause
            </button>
            <button
              onClick={stopRecording}
              className="bg-bright-orange hover:bg-goldenrod text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Stop
            </button>
          </>
        )}

        {recordingState.status === 'paused' && (
          <>
            <button
              onClick={resumeRecording}
              className="btn-primary"
            >
              Resume
            </button>
            <button
              onClick={stopRecording}
              className="bg-bright-orange hover:bg-goldenrod text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Stop
            </button>
          </>
        )}

        {recordingState.status === 'stopped' && (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
              rows={3}
            />
            <button
              onClick={uploadRecording}
              disabled={uploading}
              className="w-full btn-primary"
            >
              {uploading ? 'Uploading...' : 'Upload Recording'}
            </button>
          </div>
        )}
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-navy-blue/30 rounded-full h-2">
            <div
              className="bg-light-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-light-blue mt-2">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-light-blue mb-4">Your Recordings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-navy-blue/30 p-4 rounded-lg"
              >
                <video
                  className="w-full rounded"
                  controls
                  src={video.url}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-light-blue text-sm">
                    {new Date(video.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteVideo(video.title)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 