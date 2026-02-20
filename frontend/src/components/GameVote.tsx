import { useEffect, useState } from "react";
import type { Game } from "../types";

interface GameVoteProps {
  games: Game[];
}

function GameVote({ games }: GameVoteProps) {
  const [votes, setVotes] = useState<Record<number, number>>({ 1: 2, 2: 1, 3: 0, 4: 1 });
  const [userVoted, setUserVoted] = useState<number | null>(null);
  const [votingActive] = useState(true);

  useEffect(() => {
    window.lucide?.createIcons();
  }, [votes, userVoted]);

  const handleVote = (gameId: number) => {
    if (!votingActive) return;

    setVotes((prev) => {
      const newVotes = { ...prev };
      if (userVoted !== null) {
        newVotes[userVoted] = Math.max(0, newVotes[userVoted] - 1);
      }
      newVotes[gameId] = (newVotes[gameId] || 0) + 1;
      return newVotes;
    });
    setUserVoted(gameId);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sortedGames = [...games].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0));
  const winningGame = sortedGames[0];

  return (
    <div className="glass-panel rounded-lg p-6 border-cyber h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-primary/10 border border-cyber-primary/30"><i data-lucide="bar-chart-3" className="w-5 h-5 text-cyber-primary"></i></div>
          <div><h2 className="font-mono text-xl font-bold text-white uppercase tracking-wider">Mission Select</h2><p className="text-xs text-cyber-muted font-mono mt-0.5">Tactical Voting Interface | {totalVotes} Votes Cast</p></div>
        </div>
        <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${votingActive ? "bg-cyber-success animate-pulse" : "bg-cyber-muted"}`}></span><span className="text-xs font-mono text-cyber-muted uppercase">{votingActive ? "Voting Active" : "Locked"}</span></div>
      </div>

      {winningGame && totalVotes > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyber-success/20 via-cyber-success/10 to-transparent border border-cyber-success/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-cyber-success/5 animate-pulse"></div>
          <div className="relative flex items-center gap-4">
            <div className="flex-shrink-0">
              <img src={winningGame.image} alt={winningGame.title} className="w-16 h-16 rounded-lg object-cover border-2 border-cyber-success shadow-[0_0_15px_rgba(0,255,157,0.3)]" />
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-cyber-success rounded-full flex items-center justify-center border-2 border-cyber-black"><i data-lucide="crown" className="w-3 h-3 text-cyber-black"></i></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-cyber-success uppercase tracking-widest font-bold bg-cyber-success/20 px-2 py-0.5 rounded">Current Winner</span><span className="text-[10px] font-mono text-cyber-muted">{Math.round((votes[winningGame.id] / totalVotes) * 100)}% Consensus</span></div>
              <h3 className="text-xl font-bold text-white font-mono mb-1 group-hover:text-cyber-success transition-colors">{winningGame.title}</h3>
              <p className="text-xs text-cyber-muted font-mono">{votes[winningGame.id]} votes | {winningGame.genre} | {winningGame.crossplay ? "Cross-Play Enabled" : "Same Platform Only"}</p>
            </div>
            <div className="hidden md:block text-right"><div className="text-3xl font-bold text-cyber-success font-mono">#1</div><div className="text-[10px] text-cyber-muted uppercase tracking-wider">Rank</div></div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedGames.map((game, index) => {
          const voteCount = votes[game.id] || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isWinner = index === 0 && voteCount > 0;
          const isSelected = userVoted === game.id;

          return (
            <div key={game.id} onClick={() => handleVote(game.id)} className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-300 group ${isSelected ? "border-cyber-primary bg-cyber-primary/10 shadow-[0_0_20px_rgba(0,240,255,0.15)]" : isWinner ? "border-cyber-success/50 bg-cyber-success/5 hover:border-cyber-success" : "border-white/10 bg-black/20 hover:border-cyber-primary/30 hover:bg-white/5"}`}>
              <div className={`absolute left-0 top-0 h-full rounded-lg transition-all duration-500 ${isWinner ? "bg-cyber-success/10" : "bg-cyber-primary/5"}`} style={{ width: `${percentage}%` }}></div>
              <div className="relative flex items-center gap-4">
                <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${index === 0 && voteCount > 0 ? "bg-cyber-success text-cyber-black" : "bg-white/10 text-white"}`}>{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><h4 className={`font-bold font-mono truncate ${isSelected ? "text-cyber-primary" : "text-white"}`}>{game.title}</h4>{game.crossplay && <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30">X-PLAY</span>}</div>
                  <div className="flex items-center gap-3 text-xs"><span className="text-cyber-muted">{game.genre}</span><span className="w-1 h-1 rounded-full bg-cyber-muted"></span><span className={`font-mono ${isWinner ? "text-cyber-success" : "text-cyber-muted"}`}>{voteCount} {voteCount === 1 ? "vote" : "votes"}</span></div>
                </div>
                <div className="text-right"><div className={`text-lg font-bold font-mono ${isSelected ? "text-cyber-primary" : isWinner ? "text-cyber-success" : "text-white"}`}>{percentage}%</div><div className="text-[10px] text-cyber-muted uppercase tracking-wider">{isSelected ? "Your Pick" : "Click to Vote"}</div></div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-cyber-primary bg-cyber-primary" : "border-white/20 group-hover:border-cyber-primary/50"}`}>{isSelected && <i data-lucide="check" className="w-3 h-3 text-cyber-black"></i>}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 font-mono text-cyber-muted"><span className="flex items-center gap-1"><i data-lucide="clock" className="w-3 h-3"></i>Closes in 2h 14m</span><span className="flex items-center gap-1"><i data-lucide="users" className="w-3 h-3"></i>3/4 voted</span></div>
        {userVoted !== null && <button onClick={() => setUserVoted(null)} className="text-cyber-secondary hover:text-white transition-colors font-mono text-xs uppercase flex items-center gap-1"><i data-lucide="refresh-cw" className="w-3 h-3"></i>Change Vote</button>}
      </div>
    </div>
  );
}

export default GameVote;