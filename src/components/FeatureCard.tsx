import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant: "cyan" | "magenta" | "purple";
  onLaunch?: () => void;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  variant,
  onLaunch,
}: FeatureCardProps) => {
  const variantStyles = {
    cyan: {
      border: "border-primary/50 hover:border-primary",
      icon: "bg-primary/20 text-primary",
      button: "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      glow: "hover:box-glow-cyan",
    },
    magenta: {
      border: "border-secondary/50 hover:border-secondary",
      icon: "bg-secondary/20 text-secondary",
      button: "border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground",
      glow: "hover:box-glow-magenta",
    },
    purple: {
      border: "border-neon-purple/50 hover:border-neon-purple",
      icon: "bg-neon-purple/20 text-neon-purple",
      button: "border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white",
      glow: "hover:box-glow-purple",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`p-6 rounded-xl border bg-card/80 backdrop-blur-sm transition-all duration-300 hover-lift ${styles.border} ${styles.glow}`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${styles.icon}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-orbitron text-xl font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        {description}
      </p>
      <button
        onClick={onLaunch}
        className={`w-full py-3 px-4 rounded-lg border font-orbitron text-sm uppercase tracking-wider transition-all duration-300 ${styles.button}`}
      >
        Launch
      </button>
    </div>
  );
};

export default FeatureCard;
