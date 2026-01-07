import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  startTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
}

const FCFSSimulator = () => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", name: "P1", arrivalTime: 0, burstTime: 4 },
    { id: "P2", name: "P2", arrivalTime: 1, burstTime: 3 },
    { id: "P3", name: "P3", arrivalTime: 2, burstTime: 1 },
  ]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([
      ...processes,
      { id: newId, name: newId, arrivalTime: 0, burstTime: 1 },
    ]);
  };

  const removeProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id));
  };

  const updateProcess = (id: string, field: keyof Process, value: number) => {
    setProcesses(
      processes.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const runSimulation = () => {
    if (processes.length === 0) {
      toast.error("Add at least one process to simulate");
      return;
    }

    setIsRunning(true);
    setCurrentTime(0);

    // Sort by arrival time (FCFS)
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let time = 0;
    const scheduled: Process[] = [];

    sorted.forEach((process) => {
      const startTime = Math.max(time, process.arrivalTime);
      const completionTime = startTime + process.burstTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;

      scheduled.push({
        ...process,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      });

      time = completionTime;
    });

    setScheduledProcesses(scheduled);
    setTotalTime(time);

    // Animate the timeline
    let animTime = 0;
    const interval = setInterval(() => {
      animTime++;
      setCurrentTime(animTime);
      if (animTime >= time) {
        clearInterval(interval);
        setIsRunning(false);
        toast.success("Simulation complete!");
      }
    }, 500);
  };

  const reset = () => {
    setScheduledProcesses([]);
    setCurrentTime(0);
    setTotalTime(0);
    setIsRunning(false);
  };

  const avgTurnaround =
    scheduledProcesses.length > 0
      ? (
          scheduledProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) /
          scheduledProcesses.length
        ).toFixed(2)
      : "0";

  const avgWaiting =
    scheduledProcesses.length > 0
      ? (
          scheduledProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0) /
          scheduledProcesses.length
        ).toFixed(2)
      : "0";

  const colors = [
    "bg-primary",
    "bg-secondary",
    "bg-neon-purple",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-primary text-glow-cyan">
              FCFS Simulator
            </h1>
            <p className="text-muted-foreground text-sm">
              First-Come First-Served CPU Scheduling
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Process Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-orbitron text-lg text-foreground">Processes</h2>
              <button
                onClick={addProcess}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-orbitron text-sm"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-3">
              {processes.map((process, idx) => (
                <div
                  key={process.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 backdrop-blur-sm"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}
                  />
                  <span className="font-orbitron text-foreground w-12">
                    {process.name}
                  </span>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Arrival
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={process.arrivalTime}
                        onChange={(e) =>
                          updateProcess(
                            process.id,
                            "arrivalTime",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-1 rounded bg-muted border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Burst
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={process.burstTime}
                        onChange={(e) =>
                          updateProcess(
                            process.id,
                            "burstTime",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-3 py-1 rounded bg-muted border border-border text-foreground text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeProcess(process.id)}
                    className="p-2 text-destructive hover:bg-destructive/20 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-orbitron text-sm uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> Run Simulation
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 rounded-lg border border-muted-foreground text-muted-foreground hover:bg-muted transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gantt Chart & Statistics */}
          <div className="space-y-6">
            {/* Gantt Chart */}
            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <h2 className="font-orbitron text-lg text-foreground mb-4">
                Gantt Chart
              </h2>
              <div className="relative">
                {scheduledProcesses.length > 0 ? (
                  <>
                    <div className="flex h-16 rounded-lg overflow-hidden border border-border">
                      {scheduledProcesses.map((process, idx) => {
                        const width = (process.burstTime / totalTime) * 100;
                        const isActive =
                          currentTime >= (process.startTime || 0) &&
                          currentTime < (process.completionTime || 0);
                        return (
                          <div
                            key={process.id}
                            className={`${colors[idx % colors.length]} flex items-center justify-center font-orbitron text-sm transition-all duration-300 ${
                              isActive ? "opacity-100 animate-pulse" : currentTime >= (process.completionTime || 0) ? "opacity-70" : "opacity-30"
                            }`}
                            style={{ width: `${width}%` }}
                          >
                            {process.name}
                          </div>
                        );
                      })}
                    </div>
                    {/* Timeline markers */}
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
                      <span>0</span>
                      {scheduledProcesses.map((p) => (
                        <span key={p.id}>{p.completionTime}</span>
                      ))}
                    </div>
                    {/* Current time indicator */}
                    <div
                      className="absolute top-0 w-0.5 h-16 bg-foreground transition-all duration-500"
                      style={{ left: `${(currentTime / totalTime) * 100}%` }}
                    />
                  </>
                ) : (
                  <div className="h-16 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                    Run simulation to see Gantt chart
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-primary/50 bg-card/50 backdrop-blur-sm box-glow-cyan">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Avg Turnaround
                </div>
                <div className="font-orbitron text-2xl text-primary">
                  {avgTurnaround}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-secondary/50 bg-card/50 backdrop-blur-sm box-glow-magenta">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Avg Waiting
                </div>
                <div className="font-orbitron text-2xl text-secondary">
                  {avgWaiting}
                </div>
              </div>
            </div>

            {/* Process Table */}
            {scheduledProcesses.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="text-left font-orbitron text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="p-3">Process</th>
                      <th className="p-3">Arrival</th>
                      <th className="p-3">Burst</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">Complete</th>
                      <th className="p-3">TAT</th>
                      <th className="p-3">WT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledProcesses.map((p, idx) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="p-3 flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`}
                          />
                          {p.name}
                        </td>
                        <td className="p-3">{p.arrivalTime}</td>
                        <td className="p-3">{p.burstTime}</td>
                        <td className="p-3">{p.startTime}</td>
                        <td className="p-3">{p.completionTime}</td>
                        <td className="p-3 text-primary">{p.turnaroundTime}</td>
                        <td className="p-3 text-secondary">{p.waitingTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FCFSSimulator;
