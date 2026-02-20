import { useEffect, useMemo, useState } from "react";
import Achievements from "./components/Achievements";
import AlexAvailable from "./components/AlexAvailable";
import ConnectionStatus from "./components/ConnectionStatus";
import GameVote from "./components/GameVote";
import TimeSync from "./components/TimeSync";
import {
   isSupabaseConfigured,
   scheduleTableName,
   supabase,
} from "./lib/supabase";
import type { Game, ScheduleDay } from "./types";

const UA_TIMEZONE = "Europe/Kyiv";
const SCHEDULE_DAYS = 14;

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

function App() {
   const [currentTime, setCurrentTime] = useState(new Date());
   const [scheduleMap, setScheduleMap] = useState<Record<string, boolean>>({});
   const [isScheduleLoading, setIsScheduleLoading] = useState(false);
   const [scheduleError, setScheduleError] = useState<string | null>(null);

   useEffect(() => {
      const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
      return () => window.clearInterval(timer);
   }, []);

   const kyivToday = useMemo(() => formatKyivYmd(currentTime), [currentTime]);
   const kyivRangeEnd = useMemo(() => {
      const start = parseYmdToUtcNoon(kyivToday);
      const endDate = new Date(
         start.getTime() + (SCHEDULE_DAYS - 1) * 24 * 60 * 60 * 1000,
      );
      return formatKyivYmd(endDate);
   }, [kyivToday]);

   useEffect(() => {
      const db = supabase;
      if (!isSupabaseConfigured || !db) {
         setScheduleError(
            "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
         );
         return;
      }

      let isCancelled = false;

      const loadSchedule = async () => {
         setIsScheduleLoading(true);
         setScheduleError(null);

         const { data, error } = await db
            .from(scheduleTableName)
            .select("date,is_off")
            .gte("date", kyivToday)
            .lte("date", kyivRangeEnd);

         if (isCancelled) return;

         if (error) {
            setScheduleError(error.message);
            setIsScheduleLoading(false);
            return;
         }

         const nextMap: Record<string, boolean> = {};
         (data ?? []).forEach((row: { date: string; is_off: boolean }) => {
            nextMap[row.date] = row.is_off;
         });

         setScheduleMap(nextMap);
         setIsScheduleLoading(false);
      };

      void loadSchedule();

      return () => {
         isCancelled = true;
      };
   }, [kyivToday, kyivRangeEnd]);

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
         const isOff = scheduleMap[key] ?? false;

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

   const toggleDay = async (dayKey: string) => {
      const db = supabase;
      if (!isSupabaseConfigured || !db) return;

      setScheduleError(null);
      const previousValue = scheduleMap[dayKey] ?? false;
      const nextValue = !previousValue;

      setScheduleMap((prev) => {
         const next = { ...prev };
         next[dayKey] = nextValue;
         return next;
      });

      const { error } = await db
         .from(scheduleTableName)
         .upsert({ date: dayKey, is_off: nextValue }, { onConflict: "date" });

      if (error) {
         setScheduleMap((prev) => {
            const next = { ...prev };
            next[dayKey] = previousValue;
            return next;
         });
         setScheduleError(error.message);
      }
   };

   const resetToWeekends = async () => {
      const db = supabase;
      if (!isSupabaseConfigured || !db) return;

      setIsScheduleLoading(true);
      setScheduleError(null);

      const { error } = await db
         .from(scheduleTableName)
         .delete()
         .gte("date", kyivToday)
         .lte("date", kyivRangeEnd);

      if (error) {
         setScheduleError(error.message);
         setIsScheduleLoading(false);
         return;
      }

      setScheduleMap({});
      setIsScheduleLoading(false);
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
                  <Achievements />

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
                  <AlexAvailable
                     scheduleDays={scheduleDays}
                     onToggleDay={toggleDay}
                     isLoading={isScheduleLoading}
                     errorMessage={scheduleError}
                  />

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
