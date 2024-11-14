'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we have a session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      }
    }
    checkSession()
  }, [router])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({
        text: 'Passwords do not match',
        type: 'error',
      })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setMessage({
        text: 'Password updated successfully',
        type: 'success',
      })

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      setMessage({
        text: 'Failed to update password',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8 bg-navy-blue/20 p-8 rounded-lg backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-light-blue">Update Password</h2>
          <p className="mt-2 text-goldenrod">Enter your new password</p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="mt-8 space-y-6">
          {message && (
            <div
              className={`text-center p-2 rounded ${
                message.type === 'success'
                  ? 'bg-green-100/10 text-green-400'
                  : 'bg-red-100/10 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
                placeholder="New password"
                minLength={6}
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  )
} 