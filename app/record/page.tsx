import ScreenRecorder from '@/components/ScreenRecorder'
import VideoPlayer from '@/components/VideoPlayer'

export default function RecordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <ScreenRecorder />
      <div className="mt-8 w-full">
        <VideoPlayer />
      </div>
    </main>
  )
} 