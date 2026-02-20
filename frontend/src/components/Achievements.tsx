interface GameStat {
  name: string;
  sessions: number;
}

const topGames: GameStat[] = [
  { name: "Apex Legends", sessions: 28 },
  { name: "Rocket League", sessions: 19 },
  { name: "Call of Duty", sessions: 14 },
];

function Achievements() {
  const totalSessions = 74;
  const wins = 41;
  const winRate = Math.round((wins / totalSessions) * 100);

  return (
    <div className="glass-panel rounded-lg p-6 border-cyber border-cyber-secondary/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
          <i data-lucide="trophy" className="w-5 h-5 text-cyber-secondary"></i>
          ACHIEVEMENTS
        </h3>
        <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/40">
          Demo Data
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded border border-white/10 bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-widest text-cyber-muted font-mono">Total Games</p>
          <p className="text-2xl font-bold font-mono text-white">{totalSessions}</p>
        </div>
        <div className="rounded border border-cyber-success/30 bg-cyber-success/10 p-3">
          <p className="text-[10px] uppercase tracking-widest text-cyber-muted font-mono">Wins</p>
          <p className="text-2xl font-bold font-mono text-cyber-success">{wins}</p>
        </div>
        <div className="rounded border border-cyber-primary/30 bg-cyber-primary/10 p-3">
          <p className="text-[10px] uppercase tracking-widest text-cyber-muted font-mono">Win Rate</p>
          <p className="text-2xl font-bold font-mono text-cyber-primary">{winRate}%</p>
        </div>
      </div>

      <div className="rounded border border-white/10 bg-black/20 p-3">
        <p className="text-[10px] uppercase tracking-widest text-cyber-muted font-mono mb-2">Most Played Games</p>
        <div className="space-y-2">
          {topGames.map((game, index) => (
            <div key={game.name} className="flex items-center justify-between text-sm font-mono">
              <span className="text-white">
                #{index + 1} {game.name}
              </span>
              <span className="text-cyber-primary">{game.sessions} sessions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Achievements;
