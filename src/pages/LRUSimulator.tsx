import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw, StepForward, FastForward } from "lucide-react";
import { toast } from "sonner";

interface Frame {
  page: number | null;
  isNew: boolean;
  isHit: boolean;
}

interface Step {
  page: number;
  frames: Frame[];
  isPageFault: boolean;
  replacedPage: number | null;
}

const LRUSimulator = () => {
  const [referenceString, setReferenceString] = useState("7,0,1,2,0,3,0,4,2,3,0,3,2");
  const [frameCount, setFrameCount] = useState(3);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [pageFaults, setPageFaults] = useState(0);
  const [pageHits, setPageHits] = useState(0);

  const parseReferenceString = (): number[] => {
    return referenceString
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
  };

  const runLRU = () => {
    const pages = parseReferenceString();
    if (pages.length === 0) {
      toast.error("Enter a valid reference string");
      return;
    }

    const frames: (number | null)[] = Array(frameCount).fill(null);
    const lastUsed: Map<number, number> = new Map();
    const simulationSteps: Step[] = [];
    let faults = 0;
    let hits = 0;

    pages.forEach((page, time) => {
      const frameIndex = frames.indexOf(page);
      const isHit = frameIndex !== -1;
      let replacedPage: number | null = null;

      if (isHit) {
        hits++;
        lastUsed.set(page, time);
      } else {
        faults++;
        const emptyIndex = frames.indexOf(null);

        if (emptyIndex !== -1) {
          frames[emptyIndex] = page;
        } else {
          // Find LRU page
          let lruPage = frames[0];
          let lruTime = lastUsed.get(frames[0] as number) ?? -1;

          frames.forEach((f) => {
            if (f !== null) {
              const usedTime = lastUsed.get(f) ?? -1;
              if (usedTime < lruTime) {
                lruTime = usedTime;
                lruPage = f;
              }
            }
          });

          replacedPage = lruPage;
          const replaceIndex = frames.indexOf(lruPage);
          frames[replaceIndex] = page;
        }
        lastUsed.set(page, time);
      }

      simulationSteps.push({
        page,
        frames: frames.map((f, idx) => ({
          page: f,
          isNew: !isHit && f === page,
          isHit: isHit && idx === frameIndex,
        })),
        isPageFault: !isHit,
        replacedPage,
      });
    });

    setSteps(simulationSteps);
    setPageFaults(faults);
    setPageHits(hits);
    setCurrentStep(-1);
    toast.success("Simulation ready! Step through or auto-play.");
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const autoPlay = async () => {
    if (steps.length === 0) {
      toast.error("Run simulation first");
      return;
    }

    setIsRunning(true);
    setCurrentStep(-1);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCurrentStep(i);
    }

    setIsRunning(false);
    toast.success("Simulation complete!");
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(-1);
    setPageFaults(0);
    setPageHits(0);
    setIsRunning(false);
  };

  const pages = parseReferenceString();
  const hitRatio = steps.length > 0 ? ((pageHits / steps.length) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg border border-secondary/50 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-secondary text-glow-magenta">
              LRU Simulator
            </h1>
            <p className="text-muted-foreground text-sm">
              Least Recently Used Page Replacement
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">
              Reference String (comma-separated)
            </label>
            <input
              type="text"
              value={referenceString}
              onChange={(e) => setReferenceString(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground font-mono"
              placeholder="7,0,1,2,0,3,0,4,2,3,0,3,2"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">
              Frame Count
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={frameCount}
              onChange={(e) => setFrameCount(parseInt(e.target.value) || 3)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground font-mono"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={runLRU}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-orbitron text-sm uppercase tracking-wider hover:opacity-90 transition-all"
          >
            <Play className="w-4 h-4" /> Prepare
          </button>
          <button
            onClick={stepForward}
            disabled={isRunning || steps.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-secondary text-secondary font-orbitron text-sm uppercase tracking-wider hover:bg-secondary hover:text-secondary-foreground transition-all disabled:opacity-50"
          >
            <StepForward className="w-4 h-4" /> Step
          </button>
          <button
            onClick={autoPlay}
            disabled={isRunning || steps.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary font-orbitron text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
          >
            <FastForward className="w-4 h-4" /> Auto-Play
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 rounded-lg border border-muted-foreground text-muted-foreground hover:bg-muted transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Visualization */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Memory Frames */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <h2 className="font-orbitron text-lg text-foreground mb-4">
                Memory Frames
              </h2>

              {/* Page sequence */}
              <div className="flex flex-wrap gap-2 mb-6">
                {pages.map((page, idx) => {
                  const isCurrentPage = idx === currentStep;
                  const isPast = idx < currentStep;
                  const isFault = steps[idx]?.isPageFault;

                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-orbitron text-sm border transition-all duration-300 ${
                        isCurrentPage
                          ? isFault
                            ? "bg-destructive border-destructive text-white scale-110"
                            : "bg-green-500 border-green-500 text-white scale-110"
                          : isPast
                          ? isFault
                            ? "bg-destructive/30 border-destructive/50 text-destructive"
                            : "bg-green-500/30 border-green-500/50 text-green-400"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {page}
                    </div>
                  );
                })}
              </div>

              {/* Frames visualization */}
              <div className="flex gap-4 justify-center">
                {Array(frameCount)
                  .fill(null)
                  .map((_, frameIdx) => {
                    const currentFrameState =
                      currentStep >= 0 ? steps[currentStep]?.frames[frameIdx] : null;
                    const page = currentFrameState?.page;
                    const isNew = currentFrameState?.isNew;
                    const isHit = currentFrameState?.isHit;

                    return (
                      <div key={frameIdx} className="text-center">
                        <div className="text-xs text-muted-foreground mb-2 font-mono">
                          Frame {frameIdx}
                        </div>
                        <div
                          className={`w-20 h-24 rounded-xl border-2 flex items-center justify-center font-orbitron text-2xl transition-all duration-500 ${
                            page !== null
                              ? isNew
                                ? "border-destructive bg-destructive/20 text-destructive animate-pulse"
                                : isHit
                                ? "border-green-500 bg-green-500/20 text-green-400"
                                : "border-secondary bg-secondary/20 text-secondary"
                              : "border-border border-dashed text-muted-foreground"
                          }`}
                        >
                          {page !== null ? page : "-"}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Current step info */}
              {currentStep >= 0 && steps[currentStep] && (
                <div className="mt-6 p-4 rounded-lg bg-muted text-center">
                  <span className="font-orbitron">
                    Accessing page{" "}
                    <span className="text-primary">{steps[currentStep].page}</span>
                    {" → "}
                    {steps[currentStep].isPageFault ? (
                      <span className="text-destructive">PAGE FAULT</span>
                    ) : (
                      <span className="text-green-400">HIT</span>
                    )}
                    {steps[currentStep].replacedPage !== null && (
                      <span className="text-muted-foreground">
                        {" "}(replaced {steps[currentStep].replacedPage})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-destructive/50 bg-card/50 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Page Faults
              </div>
              <div className="font-orbitron text-4xl text-destructive">
                {currentStep >= 0
                  ? steps.slice(0, currentStep + 1).filter((s) => s.isPageFault).length
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">
                of {steps.length} total accesses
              </div>
            </div>

            <div className="p-6 rounded-xl border border-green-500/50 bg-card/50 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Page Hits
              </div>
              <div className="font-orbitron text-4xl text-green-400">
                {currentStep >= 0
                  ? steps.slice(0, currentStep + 1).filter((s) => !s.isPageFault).length
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Hit Ratio: {currentStep >= 0 
                  ? ((steps.slice(0, currentStep + 1).filter((s) => !s.isPageFault).length / (currentStep + 1)) * 100).toFixed(1)
                  : "0"}%
              </div>
            </div>

            <div className="p-6 rounded-xl border border-primary/50 bg-card/50 backdrop-blur-sm box-glow-cyan">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Progress
              </div>
              <div className="font-orbitron text-2xl text-primary">
                {currentStep + 1} / {steps.length}
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LRUSimulator;
