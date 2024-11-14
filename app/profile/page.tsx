'use client'

import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })

      if (error) throw error
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage('Error updating profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8 bg-navy-blue/20 p-8 rounded-lg backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-light-blue">Profile</h2>
          <p className="mt-2 text-goldenrod">Update your profile information</p>
        </div>

        <form onSubmit={updateProfile} className="mt-8 space-y-6">
          {message && (
            <div className="text-center p-2 rounded bg-light-blue/10 text-light-blue">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-light-blue">Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue"
              />
            </div>

            <div>
              <label className="text-light-blue">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </main>
  )
} 