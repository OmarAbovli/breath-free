import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  backgroundColor?: string
  iconColor?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  backgroundColor = 'bg-primary',
  iconColor = 'text-primary-foreground',
}: StatCardProps) {
  return (
    <Card className="p-6 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${backgroundColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className="pt-2">
          <span
            className={`text-xs font-semibold ${
              trend.isPositive ? 'text-accent' : 'text-destructive'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
          </span>
        </div>
      )}
    </Card>
  )
}
