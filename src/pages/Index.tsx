import { Trophy, Zap, Target, Cpu, MonitorDot, CircleHelp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroTitle from "@/components/HeroTitle";
import StatsCard from "@/components/StatsCard";
import FeatureCard from "@/components/FeatureCard";
import CTASection from "@/components/CTASection";

const Index = () => {
  const navigate = useNavigate();

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
            onLaunch={() => navigate("/fcfs")}
          />
          <FeatureCard
            icon={MonitorDot}
            title="LRU Simulator"
            description="Watch page replacement happen in real-time with animated memory frames"
            variant="magenta"
            onLaunch={() => navigate("/lru")}
          />
          <FeatureCard
            icon={CircleHelp}
            title="OS Quiz"
            description="Test your knowledge and earn XP with gamified quiz challenges"
            variant="purple"
            onLaunch={() => navigate("/quiz")}
          />
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto">
          <CTASection
            onPlayFCFS={() => navigate("/fcfs")}
            onPlayLRU={() => navigate("/lru")}
            onTakeQuiz={() => navigate("/quiz")}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
