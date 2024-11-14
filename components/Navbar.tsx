'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="fixed w-full bg-dark-purple/90 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="nav-link">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="nav-link"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="nav-link">
                Sign In
              </Link>
            )}
            {user && (
              <Link href="/record" className="nav-link">
                Record
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 