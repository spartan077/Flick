'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) throw error

      setMessage({
        text: 'Check your email for the password reset link',
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: 'Failed to send reset email',
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
          <h2 className="text-3xl font-bold text-light-blue">Reset Password</h2>
          <p className="mt-2 text-goldenrod">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleResetRequest} className="mt-8 space-y-6">
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

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
              placeholder="Email address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </main>
  )
} 