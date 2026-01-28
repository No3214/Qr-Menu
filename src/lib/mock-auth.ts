// Mock Authentication System for Local Development
// This simulates Supabase auth when no internet connection is available

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

interface MockUser {
  id: string
  email: string
  password: string // In production, this would be hashed
  created_at: string
  email_confirmed: boolean
}

interface MockRestaurant {
  id: string
  name: string
  slug: string
  user_id: string
  created_at: string
}

interface MockSession {
  user: {
    id: string
    email: string
  }
  access_token: string
  expires_at: number
}

// In-memory storage (resets on server restart)
const mockUsers: Map<string, MockUser> = new Map()
const mockRestaurants: Map<string, MockRestaurant> = new Map()
const mockSessions: Map<string, MockSession> = new Map()

// Add a demo user for testing
const demoUser: MockUser = {
  id: 'demo-user-id',
  email: 'demo@grain.com',
  password: 'Demo1234',
  created_at: new Date().toISOString(),
  email_confirmed: true,
}
mockUsers.set(demoUser.email, demoUser)

const demoRestaurant: MockRestaurant = {
  id: 'demo-restaurant-id',
  name: 'Kozbeyli Konağı',
  slug: 'kozbeyli-konagi',
  user_id: demoUser.id,
  created_at: new Date().toISOString(),
}
mockRestaurants.set(demoRestaurant.id, demoRestaurant)

export const mockAuth = {
  // Check if we should use mock auth (when Supabase is unavailable)
  shouldUseMock: (): boolean => {
    return process.env.USE_MOCK_AUTH === 'true' ||
           process.env.NODE_ENV === 'development'
  },

  // Create a new user
  createUser: async (email: string, password: string): Promise<{ user: MockUser | null; error: string | null }> => {
    // Check if user already exists
    if (mockUsers.has(email.toLowerCase())) {
      return { user: null, error: 'User already registered' }
    }

    const user: MockUser = {
      id: generateId(),
      email: email.toLowerCase(),
      password, // In production, hash this!
      created_at: new Date().toISOString(),
      email_confirmed: true,
    }

    mockUsers.set(email.toLowerCase(), user)
    return { user, error: null }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<{ session: MockSession | null; error: string | null }> => {
    const user = mockUsers.get(email.toLowerCase())

    if (!user) {
      return { session: null, error: 'Invalid login credentials' }
    }

    if (user.password !== password) {
      return { session: null, error: 'Invalid login credentials' }
    }

    const session: MockSession = {
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: `mock_token_${generateId()}`,
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    mockSessions.set(session.access_token, session)
    return { session, error: null }
  },

  // Get session from token
  getSession: (token: string): MockSession | null => {
    const session = mockSessions.get(token)
    if (!session) return null
    if (session.expires_at < Date.now()) {
      mockSessions.delete(token)
      return null
    }
    return session
  },

  // Create restaurant
  createRestaurant: async (name: string, slug: string, userId: string): Promise<{ restaurant: MockRestaurant | null; error: string | null }> => {
    // Check if slug exists using Array.from
    const restaurants = Array.from(mockRestaurants.values())
    const existingSlug = restaurants.find(r => r.slug === slug)
    if (existingSlug) {
      return { restaurant: null, error: 'Slug already exists' }
    }

    const restaurant: MockRestaurant = {
      id: generateId(),
      name,
      slug,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    mockRestaurants.set(restaurant.id, restaurant)
    return { restaurant, error: null }
  },

  // Get restaurant by user ID
  getRestaurantByUserId: (userId: string): MockRestaurant | null => {
    const restaurants = Array.from(mockRestaurants.values())
    return restaurants.find(r => r.user_id === userId) || null
  },

  // Get restaurant by slug
  getRestaurantBySlug: (slug: string): MockRestaurant | null => {
    const restaurants = Array.from(mockRestaurants.values())
    return restaurants.find(r => r.slug === slug) || null
  },

  // Delete user (for cleanup)
  deleteUser: (userId: string): void => {
    const users = Array.from(mockUsers.entries())
    const userEntry = users.find(([, user]) => user.id === userId)
    if (userEntry) {
      mockUsers.delete(userEntry[0])
    }
  },

  // Get all users (for debugging)
  getAllUsers: (): MockUser[] => {
    return Array.from(mockUsers.values())
  },

  // Get demo credentials
  getDemoCredentials: () => ({
    email: 'demo@grain.com',
    password: 'Demo1234',
  }),
}
