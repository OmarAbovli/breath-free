'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  AlertCircle, 
  BarChart3, 
  Heart, 
  Users, 
  Settings 
} from 'lucide-react'

const navigationItems = [
  {
    label: 'لوحة التحكم',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'نمط الإنقاذ',
    href: '/dashboard/rescue',
    icon: AlertCircle,
  },
  {
    label: 'تقدمك',
    href: '/dashboard/progress',
    icon: BarChart3,
  },
  {
    label: 'سجل الرغبة',
    href: '/dashboard/craving',
    icon: Heart,
  },
  {
    label: 'المجتمع',
    href: '/dashboard/community',
    icon: Users,
  },
  {
    label: 'الإعدادات',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface DashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background p-4 space-y-4 lg:static lg:h-auto',
        !isOpen && 'hidden lg:block'
      )}
    >
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
