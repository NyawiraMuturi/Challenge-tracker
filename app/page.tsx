'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import AuthDialog from '@/components/Auth/AuthDialog'

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const openLogin = () => {
    setAuthMode('login')
    setIsAuthOpen(true)
  }

  const openSignup = () => {
    setAuthMode('signup')
    setIsAuthOpen(true)
  }

  return (
    <div className="max-h-screen bg-[url('/hero.jpg')] bg-cover bg-center overflow-hidden">
      <main className="h-screen relative">
        <div className="flex justify-end p-4 space-x-4">
          <Button onClick={openLogin}>Login</Button>
          <Button onClick={openSignup}>Sign Up</Button>
        </div>
        <header className="flex flex-col items-center h-full text-white">
          <h1 className="text-[160px] font-bold">JUHUDI</h1>
        </header>
        <Image
          src="/hero2.png"
          alt="Hero Image"
          width={550}
          height={600}
          className="absolute inset-0 mx-auto"
        />
      </main>

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </div>
  )
}