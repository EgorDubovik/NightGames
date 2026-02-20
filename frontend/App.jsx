const { useState, useEffect } = React;

// Main App Component
function App() {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Mock Data
    const players = [
        {
            id: 1,
            name: "NightOwl_US",
            location: "USA",
            flag: "🇺🇸",
            timezone: "EST",
            status: "online",
            game: "Waiting in Lobby",
            ping: 45,
            avatar: "http://static.photos/technology/200x200/1"
        },
        {
            id: 2,
            name: "KyivShadow",
            location: "Ukraine",
            flag: "🇺🇦",
            timezone: "EET",
            status: "online",
            game: "Apex Legends",
            ping: 120,
            avatar: "http://static.photos/gaming/200x200/2"
        },
        {
            id: 3,
            name: "LvivStriker",
            location: "Ukraine",
            flag: "🇺🇦",
            timezone: "EET",
            status: "standby",
            game: "Offline",
            ping: null,
            avatar: "http://static.photos/gaming/200x200/3"
        },
        {
            id: 4,
            name: "OdessaGhost",
            location: "Ukraine",
            flag: "🇺🇦",
            timezone: "EET",
            status: "online",
            game: "Rocket League",
            ping: 135,
            avatar: "http://static.photos/gaming/200x200/4"
        }
    ];

    const games = [
        {
            id: 1,
            title: "Apex Legends",
            genre: "Battle Royale",
            image: "http://static.photos/gaming/640x360/1",
            crossplay: true,
            lastPlayed: "2 days ago",
            playersReady: 3
        },
        {
            id: 2,
            title: "Rocket League",
            genre: "Sports",
            image: "http://static.photos/gaming/640x360/2",
            crossplay: true,
            lastPlayed: "Yesterday",
            playersReady: 2
        },
        {
            id: 3,
            title: "Call of Duty",
            genre: "FPS",
            image: "http://static.photos/gaming/640x360/3",
            crossplay: true,
            lastPlayed: "1 week ago",
            playersReady: 4
        },
        {
            id: 4,
            title: "It Takes Two",
            genre: "Co-op Adventure",
            image: "http://static.photos/gaming/640x360/4",
            crossplay: false,
            lastPlayed: "3 weeks ago",
            playersReady: 2
        }
    ];

    return (
        <div className="min-h-screen relative">
            {/* CRT Scanline Overlay */}
            <div className="scanlines"></div>
            
            {/* Background Grid Animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 animate-grid opacity-20">
                    <div className="h-full w-full" style={{
                        backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '100px 100px'
                    }}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
                
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="glitch-text font-mono text-4xl md:text-5xl font-bold text-cyber-primary tracking-tighter mb-2" data-text="NIGHT GAMES SYNC">
                            NIGHT GAMES SYNC
                        </h1>
                        <p className="text-cyber-muted font-mono text-sm tracking-widest uppercase">
                            Cross-Atlantic Tactical Gaming Interface v2.4
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <ConnectionStatus ping={45} location="USA" />
                        <button className="cyber-btn px-6 py-3 rounded font-mono text-cyber-primary font-bold uppercase tracking-wider text-sm">
                            <span className="flex items-center gap-2">
                                <i data-lucide="zap" className="w-4 h-4"></i>
                                Initiate Sync
                            </span>
                        </button>
                    </div>
                </header>

                {/* Time Sync Section */}
                <section className="mb-8">
                    <TimeSync currentTime={currentTime} />
                </section>

                {/* Countdown Section */}
                <section className="mb-8">
                    <Countdown currentTime={currentTime} />
                </section>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Squad Status & Voting */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Game Voting System */}
                        <GameVote games={games} />

                        {/* Player Status - Compact View */}
                        <div className="glass-panel rounded-lg p-6 border-cyber">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                                    <i data-lucide="users" className="w-5 h-5 text-cyber-primary"></i>
                                    SQUAD STATUS
                                </h2>
                                <span className="text-xs font-mono text-cyber-success bg-cyber-success/10 px-3 py-1 rounded-full border border-cyber-success/30">
                                    3/4 ONLINE
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {players.map(player => (
                                    <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-cyber-primary/30 transition-all group cursor-pointer">
                                        <div className="relative">
                                            <img 
                                                src={player.avatar} 
                                                alt={player.name}
                                                className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-cyber-primary/50 transition-all"
                                            />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-cyber-black ${
                                                player.status === 'online' ? 'bg-cyber-success' : 
                                                player.status === 'standby' ? 'bg-cyber-warning' : 'bg-gray-500'
                                            }`}></div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs truncate font-bold text-white font-mono">{player.name}</span>
                                                <span className="text-xs">{player.flag}</span>
                                            </div>
                                            <span className={`text-[10px] font-mono uppercase ${
                                                player.status === 'online' ? 'text-cyber-success' : 
                                                player.status === 'standby' ? 'text-cyber-warning' : 'text-cyber-muted'
                                            }`}>
                                                {player.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Activity & Chat */}
                    <div className="space-y-6">
                        {/* Next Session Info */}
                        <div className="glass-panel rounded-lg p-6 border-cyber border-cyber-secondary/30">
                            <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <i data-lucide="calendar-clock" className="w-5 h-5 text-cyber-secondary"></i>
                                NEXT WINDOW
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-cyber-muted">Date</span>
                                    <span className="font-mono text-white">Friday, Dec 15</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-cyber-muted">USA Start</span>
                                    <span className="font-mono text-cyber-primary">08:00 PM EST</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-cyber-muted">UA Start</span>
                                    <span className="font-mono text-cyber-secondary">03:00 AM EET</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-cyber-muted">Duration</span>
                                    <span className="font-mono text-white">4 Hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-panel rounded-lg p-6 border-cyber">
                            <h3 className="font-mono text-lg font-bold text-white mb-4">QUICK ACTIONS</h3>
                            <div className="space-y-3">
                                <button className="w-full cyber-btn py-3 rounded font-mono text-sm text-cyber-primary border border-cyber-primary/30 hover:bg-cyber-primary/10 transition-all flex items-center justify-center gap-2">
                                    <i data-lucide="message-square" className="w-4 h-4"></i>
                                    Squad Chat
                                </button>
                                <button className="w-full cyber-btn py-3 rounded font-mono text-sm text-cyber-secondary border border-cyber-secondary/30 hover:bg-cyber-secondary/10 transition-all flex items-center justify-center gap-2">
                                    <i data-lucide="share-2" className="w-4 h-4"></i>
                                    Share Invite
                                </button>
                                <button className="w-full cyber-btn py-3 rounded font-mono text-sm text-white border border-white/30 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <i data-lucide="settings" className="w-4 h-4"></i>
                                    Sync Settings
                                </button>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="glass-panel rounded-lg p-4 border border-cyber-warning/30 bg-cyber-warning/5">
                            <div className="flex items-start gap-3">
                                <i data-lucide="alert-triangle" className="w-5 h-5 text-cyber-warning flex-shrink-0 mt-0.5"></i>
                                <div>
                                    <h4 className="font-mono text-sm font-bold text-cyber-warning mb-1">LATENCY ALERT</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Connection to Ukraine servers showing 120ms+ latency. Consider switching to P2P hosting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 pt-6 border-t border-white/10 text-center">
                    <p className="font-mono text-xs text-cyber-muted tracking-widest">
                        NIGHT GAMES SYNC • EST. 2024 • SECURE CONNECTION ESTABLISHED
                    </p>
                </footer>
            </div>
            
            <script dangerouslySetInnerHTML={{__html: 'lucide.createIcons();'}} />
        </div>
    );
}

// Initialize App
ReactDOM.createRoot(document.getElementById('root')).render(<App />);