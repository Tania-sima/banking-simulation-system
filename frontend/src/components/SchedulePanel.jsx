import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CalendarX, CheckCircle } from 'lucide-react';

export default function SchedulePanel({ 
  reminders = [], 
  selectedDate = new Date(),
  setSelectedDate = () => {},
  onOpenReminderModal = () => {},
  onPayScheduledBill = () => {}
}) {
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const selectedDayNum = selectedDate.getDate();
  const selectedMonthNum = selectedDate.getMonth();
  const selectedYearNum = selectedDate.getFullYear();

  const selectedDateFormatted = `${selectedDayNum} ${monthNames[selectedMonthNum].slice(0, 3)} ${selectedYearNum}`;
  
  const dailyReminders = reminders.filter(rem => {
    if (!rem.dateKey) {
      return rem.dueDate && rem.dueDate.toLowerCase().includes(`${selectedDayNum} ${monthNames[selectedMonthNum].slice(0, 3).toLowerCase()}`);
    }
    return rem.dateKey === `${selectedYearNum}-${selectedMonthNum}-${selectedDayNum}`;
  });

  return (
    <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200/80 p-5 lg:p-6 flex flex-col justify-between bg-white shrink-0">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm text-[#0B2545] flex items-center space-x-1.5">
            <CalendarIcon className="w-4 h-4 text-[#028090]" />
            
          </h2>
          <div className="flex items-center space-x-1">
            <button 
              type="button"
              onClick={handlePrevMonth} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#0B2545] px-1 min-w-[100px] text-center">
              {monthNames[month]} {year}
            </span>
            <button 
              type="button"
              onClick={handleNextMonth} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border border-slate-100 rounded-2xl p-3 mb-5 shadow-2xs bg-slate-50/40">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-2">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-700">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span key={`empty-${i}`} className="h-6 w-6"></span>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isToday = isCurrentMonth && today.getDate() === day;
              const isSelected = selectedYearNum === year &&
                                 selectedMonthNum === month &&
                                 selectedDayNum === day;

              const hasReminder = reminders.some(rem => {
                if (rem.dateKey) return rem.dateKey === `${year}-${month}-${day}`;
                return rem.dueDate && rem.dueDate.toLowerCase().includes(`${day} ${monthNames[month].slice(0, 3).toLowerCase()}`);
              });

              return (
                <button
                  type="button"
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`h-6 w-6 mx-auto rounded-full flex flex-col items-center justify-center text-[11px] font-medium transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#028090] text-white font-bold shadow-xs'
                      : isToday
                      ? 'border border-[#028090] text-[#028090] font-bold'
                      : 'hover:bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <span>{day}</span>
                  {hasReminder && !isSelected && (
                    <span className="w-1 h-1 bg-[#028090] rounded-full absolute bottom-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800">Scheduled Obligations</h3>
          <span className="text-[10.5px] font-semibold text-[#028090]">{selectedDateFormatted}</span>
        </div>

        <div className="space-y-2.5">
          {dailyReminders.length === 0 ? (
            <div className="py-7 px-4 border border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center justify-center">
              <CalendarX className="w-5 h-5 text-slate-300 mb-1" />
              <p className="text-xs font-semibold text-slate-500">No Obligations Due</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Nothing scheduled for {selectedDateFormatted}.</p>
            </div>
          ) : (
            dailyReminders.map((rem) => (
              <div 
                key={rem.id} 
                className="p-3 rounded-xl border border-slate-200/80 hover:border-[#028090]/40 bg-white transition shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rem.type === 'credit' ? 'bg-[#028090]/15 text-[#028090]' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {rem.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{rem.title}</p>
                      <p className="text-[10px] text-slate-400">{rem.category} • Due: {rem.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{rem.amount}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onPayScheduledBill(rem)}
                  className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10.5px] font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>Pay & Settle Obligation</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <button 
        type="button"
        onClick={onOpenReminderModal}
        className="w-full mt-6 bg-[#0B2545] hover:bg-[#134074] text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Reminder for {selectedDayNum} {monthNames[selectedMonthNum].slice(0, 3)}</span>
      </button>
    </aside>
  );
}