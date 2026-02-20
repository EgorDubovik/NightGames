import { useEffect, useState } from "react";

interface CountdownProps {
  currentTime: Date;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function Countdown({ currentTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateNextSession = () => {
      const now = new Date();
      const nextSession = new Date(now);

      nextSession.setDate(now.getDate() + ((4 + 7 - now.getDay()) % 7));
      nextSession.setHours(20, 0, 0, 0);

      if (now.getDay() === 4 && now.getHours() >= 20) {
        nextSession.setDate(nextSession.getDate() + 7);
      }

      return nextSession;
    };

    const nextSession = calculateNextSession();
    const diff = nextSession.getTime() - currentTime.getTime();

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      const totalWeek = 7 * 24 * 60 * 60 * 1000;
      const passed = totalWeek - diff;
      setProgress((passed / totalWeek) * 100);
    }
  }, [currentTime]);

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="cyber-card glass-panel rounded-lg p-8 border-cyber border-cyber-primary/50 bg-gradient-to-br from-cyber-primary/5 to-transparent">
      <div className="text-center mb-6">
        <h2 className="font-mono text-sm tracking-[0.3em] text-cyber-primary mb-2 uppercase">Next Synchronization Window</h2>
        <div className="flex items-center justify-center gap-4 md:gap-8 font-mono">
          <div className="text-center"><div className="text-5xl md:text-6xl font-bold text-white text-glow font-mono bg-black/30 px-4 py-2 rounded border border-cyber-primary/30">{pad(timeLeft.hours)}</div><div className="text-xs text-cyber-muted mt-2 tracking-widest">HOURS</div></div>
          <div className="text-4xl text-cyber-primary animate-pulse">:</div>
          <div className="text-center"><div className="text-5xl md:text-6xl font-bold text-white text-glow font-mono bg-black/30 px-4 py-2 rounded border border-cyber-primary/30">{pad(timeLeft.minutes)}</div><div className="text-xs text-cyber-muted mt-2 tracking-widest">MINUTES</div></div>
          <div className="text-4xl text-cyber-primary animate-pulse">:</div>
          <div className="text-center"><div className="text-5xl md:text-6xl font-bold text-cyber-secondary text-glow font-mono bg-black/30 px-4 py-2 rounded border border-cyber-secondary/30">{pad(timeLeft.seconds)}</div><div className="text-xs text-cyber-muted mt-2 tracking-widest">SECONDS</div></div>
        </div>
      </div>

      <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
        <div className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs font-mono text-cyber-muted"><span>LAST SYNC</span><span>NEXT SYNC</span></div>
    </div>
  );
}

export default Countdown;