import useSWR from 'swr'
import axios from 'axios'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  addiction_level?: 'mild' | 'moderate' | 'severe'
  ai_personality?: 'friendly' | 'tough_love' | 'motivational'
  daily_vape_count?: number
  cost_per_stick?: number
  created_at?: string
  updated_at?: string
}

async function fetchProfile() {
  try {
    const response = await axios.get('/api/users/profile')
    return response.data as UserProfile
  } catch (error) {
    throw error
  }
}

export function useUser() {
  const { data: user, error, isLoading, mutate } = useSWR<UserProfile>(
    '/api/users/profile',
    fetchProfile,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    user,
    error,
    isLoading,
    isAuthenticated: !!user && !error,
    mutate,
  }
}

export async function getUserProfile(userId: string) {
  try {
    const response = await axios.get('/api/users/profile')
    return response.data
  } catch (error) {
    console.error('[v0] Failed to fetch user profile:', error)
    return null
  }
}

export async function getUserStreak(userId: string) {
  try {
    const response = await axios.get('/api/users/streak')
    return response.data
  } catch (error) {
    console.error('[v0] Failed to fetch user streak:', error)
    return null
  }
}

export async function getUserStats() {
  try {
    const response = await axios.get('/api/users/stats')
    return response.data
  } catch (error) {
    console.error('[v0] Failed to fetch user stats:', error)
    return null
  }
}
