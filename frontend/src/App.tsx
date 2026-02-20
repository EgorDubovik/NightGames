import { useEffect, useMemo, useState } from "react";
import ConnectionStatus from "./components/ConnectionStatus";
import GameVote from "./components/GameVote";
import TimeSync from "./components/TimeSync";
import type { Game } from "./types";

const UA_TIMEZONE = "Europe/Kyiv";
const US_TIMEZONE = "America/New_York";
const SCHEDULE_DAYS = 14;
const STORAGE_KEY = "alex-availability-v1";

interface ScheduleDay {
   key: string;
   date: Date;
   dayName: string;
   dayNumber: string;
   monthName: string;
   isOff: boolean;
   isNightGame: boolean;
}

interface TimeWithDayShift {
   time: string;
   dayShift: -1 | 0 | 1;
}

function parseYmdToUtcNoon(ymd: string): Date {
   const [year, month, day] = ymd.split("-").map(Number);
   return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function formatKyivYmd(date: Date): string {
   return new Intl.DateTimeFormat("en-CA", {
      timeZone: UA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
   }).format(date);
}

function getOffsetMinutes(date: Date, timeZone: string): number {
   const zonedDate = new Date(date.toLocaleString("en-US", { timeZone }));
   return Math.round((zonedDate.getTime() - date.getTime()) / 60000);
}

function formatTimeWithDayShift(totalMinutes: number): TimeWithDayShift {
   let normalized = totalMinutes;
   let dayShift = 0;

   while (normalized < 0) {
      normalized += 1440;
      dayShift -= 1;
   }

   while (normalized >= 1440) {
      normalized -= 1440;
      dayShift += 1;
   }

   const hours = Math.floor(normalized / 60);
   const minutes = normalized % 60;

   return {
      time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      dayShift: dayShift as -1 | 0 | 1,
   };
}

function dayShiftLabel(dayShift: -1 | 0 | 1): string {
   if (dayShift === -1) return "previous day";
   if (dayShift === 1) return "next day";
   return "same day";
}

function App() {
   const [currentTime, setCurrentTime] = useState(new Date());
   const [scheduleMap, setScheduleMap] = useState<Record<string, boolean>>({});

   useEffect(() => {
      const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
      return () => window.clearInterval(timer);
   }, []);

   useEffect(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
         const parsed = JSON.parse(saved) as Record<string, boolean>;
         setScheduleMap(parsed);
      } catch {
         setScheduleMap({});
      }
   }, []);

   useEffect(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleMap));
   }, [scheduleMap]);

   useEffect(() => {
      window.lucide?.createIcons();
   }, [currentTime, scheduleMap]);

   const kyivToday = useMemo(() => formatKyivYmd(currentTime), [currentTime]);

   const scheduleDays = useMemo<ScheduleDay[]>(() => {
      const start = parseYmdToUtcNoon(kyivToday);
      const rawDays = Array.from({ length: SCHEDULE_DAYS }, (_, index) => {
         const dayDate = new Date(
            start.getTime() + index * 24 * 60 * 60 * 1000,
         );
         const key = formatKyivYmd(dayDate);
         const weekday = new Intl.DateTimeFormat("en-US", {
            timeZone: UA_TIMEZONE,
            weekday: "short",
         }).format(dayDate);
         const dayNumber = new Intl.DateTimeFormat("en-US", {
            timeZone: UA_TIMEZONE,
            day: "2-digit",
         }).format(dayDate);
         const monthName = new Intl.DateTimeFormat("en-US", {
            timeZone: UA_TIMEZONE,
            month: "short",
         }).format(dayDate);
         const weekend = weekday === "Sat" || weekday === "Sun";
         const isOff = scheduleMap[key] ?? weekend;

         return {
            key,
            date: dayDate,
            dayName: weekday,
            dayNumber,
            monthName,
            isOff,
            isNightGame: false,
         };
      });

      return rawDays.map((day, index) => ({
         ...day,
         isNightGame: index < rawDays.length - 1 && rawDays[index + 1].isOff,
      }));
   }, [kyivToday, scheduleMap]);

   const formatUsWindow = (
      day: ScheduleDay,
   ): { start: TimeWithDayShift; end: TimeWithDayShift } => {
      const uaOffset = getOffsetMinutes(day.date, UA_TIMEZONE);
      const usOffset = getOffsetMinutes(day.date, US_TIMEZONE);
      const offsetDiff = usOffset - uaOffset;

      const uaStartMinutes = 22 * 60 + 30;
      const uaEndMinutes = 26 * 60 + 30;

      return {
         start: formatTimeWithDayShift(uaStartMinutes + offsetDiff),
         end: formatTimeWithDayShift(uaEndMinutes + offsetDiff),
      };
   };

   const upcomingNightGames = useMemo(
      () => scheduleDays.filter((day) => day.isNightGame),
      [scheduleDays],
   );
   const nextNightGame = upcomingNightGames[0] ?? null;
   const nextUsWindow = nextNightGame ? formatUsWindow(nextNightGame) : null;

   const games = useMemo<Game[]>(
      () => [
         {
            id: 1,
            title: "Apex Legends",
            genre: "Battle Royale",
            image: "http://static.photos/gaming/640x360/1",
            crossplay: true,
            lastPlayed: "2 days ago",
            playersReady: 3,
         },
         {
            id: 2,
            title: "Rocket League",
            genre: "Sports",
            image: "http://static.photos/gaming/640x360/2",
            crossplay: true,
            lastPlayed: "Yesterday",
            playersReady: 2,
         },
         {
            id: 3,
            title: "Call of Duty",
            genre: "FPS",
            image: "http://static.photos/gaming/640x360/3",
            crossplay: true,
            lastPlayed: "1 week ago",
            playersReady: 4,
         },
         {
            id: 4,
            title: "It Takes Two",
            genre: "Co-op Adventure",
            image: "http://static.photos/gaming/640x360/4",
            crossplay: false,
            lastPlayed: "3 weeks ago",
            playersReady: 2,
         },
      ],
      [],
   );

   const toggleDay = (dayKey: string) => {
      setScheduleMap((prev) => {
         const next = { ...prev };
         next[dayKey] = !(prev[dayKey] ?? false);
         return next;
      });
   };

   const resetToWeekends = () => {
      setScheduleMap({});
   };

   return (
      <div className="min-h-screen relative">
         <div className="scanlines"></div>
         <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 animate-grid opacity-20">
               <div
                  className="h-full w-full"
                  style={{
                     backgroundImage:
                        "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
                     backgroundSize: "100px 100px",
                  }}
               ></div>
            </div>
         </div>

         <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
            <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
               <div>
                  <h1
                     className="glitch-text font-mono text-4xl md:text-5xl font-bold text-cyber-primary tracking-tighter mb-2"
                     data-text="NIGHT GAMES SYNC"
                  >
                     NIGHT GAMES SYNC
                  </h1>
                  <p className="text-cyber-muted font-mono text-sm tracking-widest uppercase">
                     Alex Availability Dashboard | UA + US Sync
                  </p>
               </div>

               <div className="flex items-center gap-4">
                  <ConnectionStatus ping={45} location="US Host" />
                  <button
                     onClick={resetToWeekends}
                     className="cyber-btn px-5 py-3 rounded font-mono text-cyber-primary font-bold uppercase tracking-wider text-xs"
                  >
                     Reset Schedule
                  </button>
               </div>
            </header>

            <section className="mb-8">
               <TimeSync currentTime={currentTime} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
               <div className="lg:col-span-2 space-y-6">
                  <div className="glass-panel rounded-lg p-6 border-cyber border-cyber-secondary/30">
                     <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i
                           data-lucide="sparkles"
                           className="w-5 h-5 text-cyber-secondary"
                        ></i>
                        NEXT NIGHT GAME
                     </h3>
                     {!nextNightGame && (
                        <p className="text-sm text-cyber-muted font-mono">
                           No upcoming slot in current plan.
                        </p>
                     )}
                     {nextNightGame && nextUsWindow && (
                        <div className="p-3 rounded-lg border border-white/10 bg-black/20">
                           <p className="text-sm font-mono text-white">
                              {nextNightGame.dayName}, {nextNightGame.monthName}{" "}
                              {nextNightGame.dayNumber}
                           </p>
                           <p className="text-[11px] text-cyber-secondary font-mono mt-1">
                              UA: 22:30 to 02:30
                           </p>
                           <p className="text-[11px] text-cyber-primary font-mono">
                              US: {nextUsWindow.start.time} to{" "}
                              {nextUsWindow.end.time}
                           </p>
                           <p className="text-[10px] text-gray-500 font-mono uppercase">
                              US day shift:{" "}
                              {dayShiftLabel(nextUsWindow.start.dayShift)} /{" "}
                              {dayShiftLabel(nextUsWindow.end.dayShift)}
                           </p>
                        </div>
                     )}
                  </div>

                  <div className="glass-panel rounded-lg p-6 border-cyber">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                           <i
                              data-lucide="joystick"
                              className="w-5 h-5 text-cyber-primary"
                           ></i>
                           GAME VOTE / SESSION PLAN
                        </h2>
                        <p className="text-xs text-cyber-muted font-mono uppercase">
                           Pick what to play next
                        </p>
                     </div>
                     <GameVote games={games} />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="glass-panel rounded-lg p-6 border-cyber">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                           <i
                              data-lucide="calendar-days"
                              className="w-5 h-5 text-cyber-primary"
                           ></i>
                           ALEX AVAILABLE
                        </h3>
                        <p className="text-[10px] text-cyber-muted font-mono uppercase">
                           Tap to toggle
                        </p>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {scheduleDays.map((day) => (
                           <button
                              key={day.key}
                              onClick={() => toggleDay(day.key)}
                              className={`text-left rounded-lg p-2 border transition-all ${
                                 day.isNightGame
                                    ? "border-cyber-primary bg-cyber-primary/10"
                                    : day.isOff
                                      ? "border-cyber-success/40 bg-cyber-success/10"
                                      : "border-white/10 bg-black/20 hover:border-cyber-warning/40"
                              }`}
                           >
                              <p className="font-mono text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">
                                 <span className="text-cyber-muted">
                                    {day.dayName}
                                 </span>{" "}
                                 <span className="text-white font-bold">
                                    {day.dayNumber} {day.monthName}
                                 </span>{" "}
                                 <span
                                    className={
                                       day.isOff
                                          ? "text-cyber-success"
                                          : "text-cyber-warning"
                                    }
                                 >
                                    {day.isOff ? "Off" : "Work"}
                                 </span>
                              </p>
                           </button>
                        ))}
                     </div>

                     <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-cyber-warning/20 text-cyber-warning">
                           Work
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyber-success/20 text-cyber-success">
                           Off
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyber-primary/20 text-cyber-primary">
                           Night Game
                        </span>
                     </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 border border-cyber-warning/30 bg-cyber-warning/5">
                     <div className="flex items-start gap-3">
                        <i
                           data-lucide="info"
                           className="w-5 h-5 text-cyber-warning flex-shrink-0 mt-0.5"
                        ></i>
                        <div>
                           <h4 className="font-mono text-sm font-bold text-cyber-warning mb-1">
                              RULE
                           </h4>
                           <p className="text-xs text-gray-400 leading-relaxed">
                              Night Game is marked on the evening before Alex's
                              OFF day. Toggle calendar cells to update the plan.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <footer className="mt-12 pt-6 border-t border-white/10 text-center">
               <p className="font-mono text-xs text-cyber-muted tracking-widest">
                  NIGHT GAMES SYNC | BUILT FOR CROSS-TIMEZONE CHAOS
               </p>
            </footer>
         </div>
      </div>
   );
}

export default App;
