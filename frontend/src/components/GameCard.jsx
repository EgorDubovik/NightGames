function GameCard({ game }) {
  return (
    <div className="cyber-card group relative overflow-hidden rounded-lg border border-white/10 hover:border-cyber-secondary/50 transition-all cursor-pointer bg-black/20">
      <div className="relative h-32 overflow-hidden">
        <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent"></div>

        {game.crossplay && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-cyber-primary/20 backdrop-blur-sm border border-cyber-primary/50 rounded text-[10px] font-mono text-cyber-primary font-bold uppercase tracking-wider">
            Cross-Play
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white">
          <i data-lucide="users" className="w-3 h-3 text-cyber-success"></i>
          <span>{game.playersReady} Ready</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white mb-1 group-hover:text-cyber-secondary transition-colors font-mono">{game.title}</h3>
        <p className="text-xs text-cyber-muted mb-3 uppercase tracking-wider">{game.genre}</p>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-mono">Last: {game.lastPlayed}</span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/50 hover:bg-cyber-secondary/30 font-mono text-xs uppercase">
            Select
          </button>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-cyber-secondary/0 group-hover:border-cyber-secondary/30 rounded-lg transition-all pointer-events-none"></div>
    </div>
  );
}

export default GameCard;
