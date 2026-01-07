import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

const StatsCard = ({ icon: Icon, value, label }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover-lift">
      <Icon className="w-6 h-6 text-primary mb-2" />
      <span className="font-orbitron text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default StatsCard;
