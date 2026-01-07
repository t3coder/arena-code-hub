const HeroTitle = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="font-orbitron text-6xl md:text-8xl font-bold tracking-wider mb-6">
        <span className="text-primary text-glow-cyan">OS</span>
        <span className="text-secondary text-glow-magenta">ARENA</span>
      </h1>
      <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-6">
        Master Operating Systems Through{" "}
        <span className="text-primary font-semibold">Interactive</span> Simulations
        & Games
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
        <span className="w-2 h-2 rounded-full bg-green-500 pulse-glow" />
        <span className="tracking-widest uppercase">System Online</span>
      </div>
    </div>
  );
};

export default HeroTitle;
