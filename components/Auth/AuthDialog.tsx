'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { detectTimezone } from '@/utils/timezone'
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export default function AuthDialog({ isOpen, onClose, defaultMode = 'login' }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const { signIn, signUp } = useAuthStore()
  const router = useRouter()

  // Login form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Signup form
  const signupForm = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const resetForms = () => {
    loginForm.reset()
    signupForm.reset()
    setGeneralError('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    resetForms()
  }

  const onLoginSubmit = async (data: LoginInput) => {
    setGeneralError('')

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setGeneralError(error.message)
    } else {
      router.push('/dashboard')
      onClose()
      resetForms()
    }
  }

  const onSignupSubmit = async (data: SignupInput) => {
    setGeneralError('')

    const { error } = await signUp(data.email, data.password)

    if (error) {
      setGeneralError(error.message)
    } else {
      // Create profile with username and timezone
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const timezone = detectTimezone()
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          username: data.username,
          timezone,
          notification_time: '08:00:00',
        })
      }

      router.push('/dashboard')
      onClose()
      resetForms()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Enter your credentials to access your challenges' 
              : 'Start tracking your 90-day challenges today'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'login' ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {generalError && (
                <p className="text-sm text-red-500">{generalError}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? 'Loading...' : 'Login'}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {generalError && (
                <p className="text-sm text-red-500">{generalError}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={signupForm.formState.isSubmitting}
              >
                {signupForm.formState.isSubmitting ? 'Loading...' : 'Create Account'}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}