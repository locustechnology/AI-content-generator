'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string

  // Request an OTP to be sent to the user's email
  const { error, data } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error('Login error:', error.message)
    return redirect('/error')
  }

  // If OTP is sent successfully
  if (data) {
    console.log('OTP sent successfully')
    return redirect('/check-email') // Redirect to a page where the user is instructed to check their email
  }

  revalidatePath('/')
  return redirect('/overview')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    console.error('Signup error:', error.message)
    return redirect('/error')
  }

  revalidatePath('/')
  return redirect('/overview')
}
