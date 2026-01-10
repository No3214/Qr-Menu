import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get restaurant info
  const { data: restaurantUser } = await supabase
    .from('restaurant_users')
    .select('restaurant_id, restaurants(name, slug)')
    .eq('auth_user_id', user.id)
    .single()

  const restaurant = restaurantUser?.restaurants as { name: string; slug: string } | null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        restaurantName={restaurant?.name}
        restaurantSlug={restaurant?.slug}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
