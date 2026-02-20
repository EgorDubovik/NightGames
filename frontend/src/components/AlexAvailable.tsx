import type { ScheduleDay } from "../types";

interface AlexAvailableProps {
   scheduleDays: ScheduleDay[];
   onToggleDay: (dayKey: string) => void;
}

function AlexAvailable({ scheduleDays, onToggleDay }: AlexAvailableProps) {
   return (
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

         <div className="space-y-2">
            {scheduleDays.map((day) => (
               <button
                  key={day.key}
                  onClick={() => onToggleDay(day.key)}
                  className={`w-full text-left rounded-lg px-3 py-2 border transition-all ${
                     day.isNightGame
                        ? "border-cyber-primary bg-cyber-primary/10"
                        : day.isOff
                          ? "border-cyber-success/40 bg-cyber-success/10"
                          : "border-white/10 bg-black/20 hover:border-cyber-warning/40"
                  }`}
               >
                  <div className="flex items-center justify-between gap-2 font-mono text-[14px] whitespace-nowrap">
                     <span className="text-cyber-muted">
                        {day.dayName}{" "}
                        <span className="text-white font-bold">
                           {day.dayNumber} {day.monthName}
                        </span>
                     </span>
                     <span className="flex items-center gap-2">
                        {day.isNightGame && (
                           <span className="text-cyber-primary text-[10px] uppercase">
                              Night
                           </span>
                        )}
                        <span
                           className={
                              day.isOff
                                 ? "text-cyber-success"
                                 : "text-cyber-warning"
                           }
                        >
                           {day.isOff ? "Off" : "Work"}
                        </span>
                     </span>
                  </div>
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
   );
}

export default AlexAvailable;
