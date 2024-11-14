'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, AuthError, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession()
      if (error) {
        throw error
      }
      if (newSession) {
        setSession(newSession)
        setUser(newSession.user)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      // If refresh fails, sign out the user
      await signOut()
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: AuthChangeEvent, currentSession: Session | null) => {
            setSession(currentSession)
            setUser(currentSession?.user ?? null)

            // Handle specific auth events
            switch (event) {
              case 'SIGNED_IN':
                router.refresh()
                break
              case 'SIGNED_OUT':
                router.push('/')
                break
              case 'TOKEN_REFRESHED':
                console.log('Token refreshed successfully')
                break
              case 'USER_UPDATED':
                if (currentSession) {
                  setUser(currentSession.user)
                }
                break
            }
          }
        )

        // Set up session refresh interval
        const refreshInterval = setInterval(() => {
          if (session) {
            refreshSession()
          }
        }, 1800000) // Refresh every 30 minutes

        return () => {
          subscription.unsubscribe()
          clearInterval(refreshInterval)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [refreshSession, router, session])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            email_confirmed: true,
          }
        }
      })

      if (!error && data.user) {
        // Create profile after successful signup
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            created_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Log error to error_logs table
          await supabase
            .from('error_logs')
            .insert({
              user_id: data.user.id,
              error_type: 'PROFILE_CREATION_ERROR',
              error_message: profileError.message,
              error_details: JSON.stringify(profileError),
            })
        }
      }

      return { error }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 