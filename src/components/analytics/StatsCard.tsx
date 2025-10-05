import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  loading?: boolean;
}

export function StatsCard({ title, value, description, icon: Icon, trend, loading }: StatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-card transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700 dark:text-foreground">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-r from-accent/10 to-orange-500/10 dark:from-accent/20 dark:to-orange-500/20 rounded-lg">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-foreground mb-1">{value}</div>
        {description && (
          <p className="text-sm text-gray-600 dark:text-muted-foreground font-medium">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.value > 0
                ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                }`}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-gray-500 dark:text-muted-foreground ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
