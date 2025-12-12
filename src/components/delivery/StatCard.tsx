import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn(
      "glass rounded-xl p-5 animate-fade-in transition-all hover:scale-[1.02]",
      variant === 'primary' && "border-primary/30 glow-primary",
      variant === 'success' && "border-success/30",
      variant === 'warning' && "border-warning/30",
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === 'default' && "bg-secondary",
          variant === 'primary' && "bg-primary/10 text-primary",
          variant === 'success' && "bg-success/10 text-success",
          variant === 'warning' && "bg-warning/10 text-warning",
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
