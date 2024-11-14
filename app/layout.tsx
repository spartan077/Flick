import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Notifications from '@/components/Notifications'

export const metadata = {
  title: 'Flick - Screen Recording Made Simple',
  description: 'Record, save, and share your screen recordings with Flick',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-purple">
        <AuthProvider>
          <ProtectedRoute>
            <Navbar />
            {children}
            <Notifications />
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
} 