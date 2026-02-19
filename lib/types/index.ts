import { z } from 'zod'

// Password validation regex
// - At least 8 characters
// - At least 1 uppercase letter
// - At least 1 number
// - At least 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character (@$!%*?&)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

// Database Types
export interface Profile {
  id: string
  email: string
  username: string
  notification_time: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface Challenge {
  id: string
  user_id: string
  title: string
  duration_days: number
  start_date: string
  end_date: string
  overall_goals: string
  is_active: boolean
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface WeeklyGoal {
  id: string
  challenge_id: string
  week_number: number
  goals: string
  is_completed: boolean
  completed_at: string | null
  created_at: string
}

export interface DailyGoal {
  id: string
  challenge_id: string
  day_number: number
  goals: string
  is_completed: boolean
  completed_at: string | null
  created_at: string
}

export interface NotificationLog {
  id: string
  user_id: string
  challenge_id: string
  sent_at: string
  day_number: number
  status: 'sent' | 'failed' | 'skipped'
  error_message: string | null
}