function PlayerCard({ player }) {
    const getStatusColor = (status) => {
        switch(status) {
            case 'online': return 'text-cyber-success border-cyber-success';
            case 'standby': return 'text-cyber-warning border-cyber-warning';
            default: return 'text-cyber-muted border-cyber-muted';
        }
    };

    const getStatusDot = (status) => {
        switch(status) {
            case 'online': return 'bg-cyber-success';
            case 'standby': return 'bg-cyber-warning';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="cyber-card glass-panel p-4 rounded-lg border border-white/10 hover:border-cyber-primary/50 transition-all group">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    <img 
                        src={player.avatar} 
                        alt={player.name}
                        className="w-14 h-14 rounded-lg object-cover border-2 border-white/10 group-hover:border-cyber-primary/50 transition-all"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-cyber-black ${getStatusDot(player.status)} status-dot`}></div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white truncate font-mono">{player.name}</h3>
                        <span className="text-lg" title={player.location}>{player.flag}</span>
                    </div>
                    <p className="text-xs text-cyber-muted font-mono truncate mb-2">
                        {player.game}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-0.5 rounded border font-mono uppercase tracking-wider ${getStatusColor(player.status)} bg-opacity-10`}>
                            {player.status}
                        </span>
                        {player.ping && (
                            <span className={`font-mono flex items-center gap-1 ${player.ping > 100 ? 'text-cyber-warning' : 'text-cyber-success'}`}>
                                <i data-lucide="activity" className="w-3 h-3"></i>
                                {player.ping}ms
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded hover:bg-white/10 text-cyber-primary transition-colors" title="Message">
                        <i data-lucide="message-circle" className="w-4 h-4"></i>
                    </button>
                    <button className="p-2 rounded hover:bg-white/10 text-cyber-secondary transition-colors" title="Invite">
                        <i data-lucide="user-plus" className="w-4 h-4"></i>
                    </button>
                </div>
            </div>
            
            {/* Connection Quality Bar */}
            {player.ping && (
                <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-black/50 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${player.ping < 50 ? 'bg-cyber-success w-[90%]' : player.ping < 100 ? 'bg-cyber-warning w-[60%]' : 'bg-cyber-danger w-[30%]'}`}
                            ></div>
                        </div>
                        <span className="text-[10px] font-mono text-cyber-muted uppercase">
                            {player.ping < 50 ? 'Optimal' : player.ping < 100 ? 'Good' : 'Weak'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}