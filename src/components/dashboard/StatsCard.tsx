import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  glowClass?: string;
}

const StatsCard = ({ title, value, change, changeType = 'neutral', icon: Icon, glowClass = '' }: StatsCardProps) => {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md ${glowClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`mt-1 text-xs font-medium ${changeColor[changeType]}`}>{change}</p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
