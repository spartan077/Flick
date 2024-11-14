'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/auth') {
      router.push('/auth')
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-blue"></div>
      </div>
    )
  }

  return <>{children}</>
} 