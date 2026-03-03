import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isToday,
    parseISO,
    setMonth,
    setYear
} from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalendarProps {
    selected?: string | null; // "YYYY-MM-DD"
    onSelect: (date: string) => void;
    className?: string;
}

type ViewMode = 'days' | 'months' | 'years';

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, className }) => {
    const selectedDate = selected ? parseISO(selected) : null;
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('days');

    const daysInMonth = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];


    return (
        <div className={cn("p-4 w-72 bg-background/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl", className)} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                        className="text-sm font-semibold px-2 py-1 hover:bg-muted rounded-md transition-colors flex items-center gap-1"
                    >
                        {format(currentMonth, 'MMMM')}
                        <ChevronDown className={cn("w-3 h-3 transition-transform", viewMode === 'months' && "rotate-180")} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                        className="text-sm font-semibold px-2 py-1 hover:bg-muted rounded-md transition-colors flex items-center gap-1"
                    >
                        {format(currentMonth, 'yyyy')}
                        <ChevronDown className={cn("w-3 h-3 transition-transform", viewMode === 'years' && "rotate-180")} />
                    </button>
                </div>
                {viewMode === 'days' && (
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevMonth(); }}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextMonth(); }}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'days' && (
                <>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {weekDays.map(day => (
                            <div key={day} className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest text-center py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((day, i) => {
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isTodayDate = isToday(day);

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onSelect(format(day, 'yyyy-MM-dd'));
                                    }}
                                    className={cn(
                                        "h-8 w-8 text-xs rounded-lg transition-all duration-200 flex items-center justify-center relative",
                                        !isCurrentMonth && "text-muted-foreground/20",
                                        isCurrentMonth && "hover:bg-muted",
                                        isSelected && "bg-primary text-primary-foreground font-bold shadow-soft scale-110 z-10 hover:bg-primary/90",
                                        isTodayDate && !isSelected && "text-primary font-bold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                                    )}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {viewMode === 'months' && (
                <div className="grid grid-cols-3 gap-2 py-2">
                    {months.map((month, i) => (
                        <button
                            key={month}
                            type="button"
                            onClick={() => {
                                setCurrentMonth(setMonth(currentMonth, i));
                                setViewMode('days');
                            }}
                            className={cn(
                                "py-3 text-xs rounded-xl transition-all hover:bg-muted",
                                currentMonth.getMonth() === i && "bg-primary/10 text-primary font-bold"
                            )}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            )}

            {viewMode === 'years' && (
                <div className="grid grid-cols-3 gap-2 py-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                    {Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - 1 + i).map(year => (
                        <button
                            key={year}
                            type="button"
                            onClick={() => {
                                setCurrentMonth(setYear(currentMonth, year));
                                setViewMode('days');
                            }}
                            className={cn(
                                "py-3 text-xs rounded-xl transition-all hover:bg-muted",
                                currentMonth.getFullYear() === year && "bg-primary/10 text-primary font-bold"
                            )}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
