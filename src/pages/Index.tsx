import { Trophy, Zap, Target, Cpu, MonitorDot, CircleHelp } from "lucide-react";
import HeroTitle from "@/components/HeroTitle";
import StatsCard from "@/components/StatsCard";
import FeatureCard from "@/components/FeatureCard";
import CTASection from "@/components/CTASection";
import { toast } from "sonner";

const Index = () => {
  const handleLaunch = (simulator: string) => {
    toast.success(`Launching ${simulator}...`, {
      description: "Get ready to master OS concepts!",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <HeroTitle />

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16">
          <StatsCard icon={Trophy} value="10+" label="Quiz Questions" />
          <StatsCard icon={Zap} value="2" label="Simulators" />
          <StatsCard icon={Target} value="3" label="Achievements" />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={Cpu}
            title="FCFS Simulator"
            description="Visualize First-Come First-Served CPU scheduling with interactive Gantt charts"
            variant="cyan"
            onLaunch={() => handleLaunch("FCFS Simulator")}
          />
          <FeatureCard
            icon={MonitorDot}
            title="LRU Simulator"
            description="Watch page replacement happen in real-time with animated memory frames"
            variant="magenta"
            onLaunch={() => handleLaunch("LRU Simulator")}
          />
          <FeatureCard
            icon={CircleHelp}
            title="OS Quiz"
            description="Test your knowledge and earn XP with gamified quiz challenges"
            variant="purple"
            onLaunch={() => handleLaunch("OS Quiz")}
          />
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto">
          <CTASection
            onPlayFCFS={() => handleLaunch("FCFS Simulator")}
            onPlayLRU={() => handleLaunch("LRU Simulator")}
            onTakeQuiz={() => handleLaunch("OS Quiz")}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
