interface TimeSyncProps {
  currentTime: Date;
}

const DALLAS_TZ = "America/Chicago";
const UKRAINE_TZ = "Europe/Kyiv";

function getOffsetMinutes(date: Date, timeZone: string): number {
  const zonedDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return Math.round((zonedDate.getTime() - date.getTime()) / 60000);
}

function TimeSync({ currentTime }: TimeSyncProps) {
  const formatTime = (date: Date, timeZone: string) =>
    date.toLocaleTimeString("en-US", {
      timeZone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date: Date, timeZone: string) =>
    date.toLocaleDateString("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const dallasOffset = getOffsetMinutes(currentTime, DALLAS_TZ);
  const ukraineOffset = getOffsetMinutes(currentTime, UKRAINE_TZ);
  const diffHours = Math.round((ukraineOffset - dallasOffset) / 60);
  const diffLabel = diffHours >= 0 ? `+${diffHours}H` : `${diffHours}H`;

  return (
    <div className="glass-panel rounded-lg p-6 border-cyber">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-primary opacity-50"></div>
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div className="w-2 h-2 bg-cyber-primary rounded-full animate-pulse"></div></div>

        <div className="text-center md:text-left p-4 rounded bg-black/20 border border-white/5">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2"><span className="text-sm font-mono px-2 py-0.5 border border-white/20 rounded">US</span><span className="font-mono text-sm text-cyber-muted tracking-widest">DALLAS, TX (CT)</span></div>
          <div className="font-mono text-4xl font-bold text-cyber-primary text-glow mb-1">{formatTime(currentTime, DALLAS_TZ)}</div>
          <div className="text-sm text-gray-400 font-mono">{formatDate(currentTime, DALLAS_TZ)}</div>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/30"><div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse"></div><span className="text-xs font-mono text-cyber-primary">DALLAS LIVE</span></div>
        </div>

        <div className="text-center md:text-right p-4 rounded bg-black/20 border border-white/5">
          <div className="flex items-center justify-center md:justify-end gap-2 mb-2"><span className="font-mono text-sm text-cyber-muted tracking-widest">UKRAINE TIME (KYIV)</span><span className="text-sm font-mono px-2 py-0.5 border border-white/20 rounded">UA</span></div>
          <div className="font-mono text-4xl font-bold text-cyber-secondary text-glow mb-1">{formatTime(currentTime, UKRAINE_TZ)}</div>
          <div className="text-sm text-gray-400 font-mono">{formatDate(currentTime, UKRAINE_TZ)}</div>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-secondary/10 border border-cyber-secondary/30"><div className="w-2 h-2 rounded-full bg-cyber-secondary animate-pulse"></div><span className="text-xs font-mono text-cyber-secondary">UA {diffLabel}</span></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs font-mono text-cyber-muted"><span>TIME DIFFERENCE: UKRAINE {diffLabel} VS DALLAS</span><span className="w-px h-4 bg-white/20"></span><span>NIGHT WINDOW: UA 22:30-02:30</span></div>
    </div>
  );
}

export default TimeSync;
