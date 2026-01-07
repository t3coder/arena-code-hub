interface CTASectionProps {
  onPlayFCFS?: () => void;
  onPlayLRU?: () => void;
  onTakeQuiz?: () => void;
}

const CTASection = ({ onPlayFCFS, onPlayLRU, onTakeQuiz }: CTASectionProps) => {
  return (
    <div className="relative mt-16 p-8 md:p-12 rounded-2xl border border-secondary/30 bg-gradient-to-br from-card/90 to-background/80 backdrop-blur-sm">
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-neon-purple/5 pointer-events-none" />
      
      <div className="relative z-10 text-center">
        <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-4 text-foreground">
          Ready to Enter the Arena?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Start your journey to becoming an OS master. Simulate, learn, and conquer!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onPlayFCFS}
            className="px-6 py-3 rounded-lg border border-primary text-primary font-orbitron text-sm uppercase tracking-wider transition-all duration-300 hover:bg-primary hover:text-primary-foreground box-glow-cyan"
          >
            Play FCFS
          </button>
          <button
            onClick={onPlayLRU}
            className="px-6 py-3 rounded-lg border border-secondary text-secondary font-orbitron text-sm uppercase tracking-wider transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground box-glow-magenta"
          >
            Play LRU
          </button>
          <button
            onClick={onTakeQuiz}
            className="px-6 py-3 rounded-lg border border-neon-purple text-neon-purple font-orbitron text-sm uppercase tracking-wider transition-all duration-300 hover:bg-neon-purple hover:text-white box-glow-purple"
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
