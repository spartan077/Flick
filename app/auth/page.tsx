'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        router.push('/')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        setMessage({
          text: 'Check your email for the confirmation link!',
          type: 'success'
        })
      }
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : 'An error occurred',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8 bg-navy-blue/20 p-8 rounded-lg backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-light-blue">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`text-center p-2 rounded ${
              message.type === 'success' 
                ? 'bg-green-100/10 text-green-400' 
                : 'bg-red-100/10 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
              placeholder="Email address"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-light-blue/30 rounded-md bg-navy-blue/30 text-light-blue placeholder-light-blue/50"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Loading...' : isLogin ? 'Sign in' : 'Sign up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-light-blue hover:text-bright-orange"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link 
            href="/reset-password"
            className="text-light-blue hover:text-bright-orange text-sm"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </main>
  )
} 