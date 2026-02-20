function ConnectionStatus({ ping, location }) {
    const getQuality = (ms) => {
        if (ms < 50) return { label: 'EXCELLENT', color: 'text-cyber-success', dot: 'bg-cyber-success' };
        if (ms < 100) return { label: 'GOOD', color: 'text-cyber-primary', dot: 'bg-cyber-primary' };
        if (ms < 150) return { label: 'FAIR', color: 'text-cyber-warning', dot: 'bg-cyber-warning' };
        return { label: 'POOR', color: 'text-cyber-danger', dot: 'bg-cyber-danger' };
    };

    const quality = getQuality(ping);

    return (
        <div className="glass-panel px-4 py-3 rounded-lg border border-white/10 flex items-center gap-3">
            <div className="relative">
                <div className={`w-3 h-3 rounded-full ${quality.dot} status-dot`}></div>
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${quality.dot} animate-ping opacity-75`}></div>
            </div>
            <div className="text-right">
                <div className={`text-xs font-mono font-bold ${quality.color}`}>
                    {quality.label}
                </div>
                <div className="text-[10px] text-cyber-muted font-mono uppercase">
                    {location} • {ping}ms
                </div>
            </div>
        </div>
    );
}