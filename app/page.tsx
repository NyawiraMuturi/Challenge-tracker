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
    <div className="max-h-screen bg-[url('/hero.jpg')] bg-cover bg-center overflow-hidden bg-gradient-to-t from-black/80 to-transparent">
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
          className="absolute inset-0 mx-auto z-10 hidden md:block"
        />

        <section>
          <div className="absolute bottom-[5%] left-[45%] right-0 p-8 text-center border-2 border-[#709110] w-[30%] bg-[#baf11b] rounded-md">
            <h2 className="text-3xl font-bold text-black mb-4">Track Your Challenges, Achieve Your Goals</h2>
            <p className="text-lg font-light mb-6">Join Juhudi today and start your journey towards personal growth and achievement.</p>
          </div>
        </section>
      </main>

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </div>
  )
}