import { useEffect, useState } from 'react';
import { useTaskStore, useProjectStore } from '../../app/store';
import { TaskList } from '../../components/tasks/TaskList';
import {
    groupTasksByDueDate,
    formatGroupLabel,
    compareTasks,
    addDays,
    startOfDay
} from '../../utils/dates';
import { CalendarDays, ListFilter, MoreHorizontal, ChevronRight, Plus } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';
import { TaskForm } from '../../components/tasks/TaskForm';
import { Priority } from '../../types';
import { format } from 'date-fns';

export const Upcoming = () => {
    const { tasks, fetchTasks, isLoading, addTask } = useTaskStore();
    const { projects, fetchProjectsAndLabels } = useProjectStore();
    const [addingDate, setAddingDate] = useState<string | null>(null);

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks();
        }
        if (projects.length === 0) {
            fetchProjectsAndLabels();
        }
    }, [tasks.length, projects.length, fetchTasks, fetchProjectsAndLabels]);

    const now = new Date();
    const startDate = startOfDay(now);
    const endDate = addDays(startDate, 6); // 7 days inclusive

    const activeTasks = tasks.filter(t => !t.completed);
    const groupedTasks = groupTasksByDueDate(activeTasks, startDate, endDate);

    // Generate array of date objects for the next 7 days for consistent rendering
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    const handleSaveTask = (taskData: {
        title: string;
        description?: string;
        priority: Priority;
        due?: { date: string; isRecurring: boolean } | null;
        labels?: string[];
    }) => {
        addTask({
            ...taskData,
            due: taskData.due || (addingDate ? { date: addingDate, isRecurring: false } : null),
        });
        setAddingDate(null);
    };

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading upcoming weeks...</div>
            </div>
        );
    }

    const hasAnyUpcomingTasks = Object.values(groupedTasks).some(tasks => tasks.length > 0);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-premium ring-1 ring-indigo-500/20">
                        <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Upcoming</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Your schedule for the next 7 days</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <IconButton icon={ListFilter} title="View Options" />
                    <IconButton icon={MoreHorizontal} title="More Actions" />
                </div>
            </header>

            <div className="space-y-10">
                {days.map((date) => {
                    const dateKey = format(date, 'dd-MM-yyyy');
                    const isoKey = format(date, 'yyyy-MM-dd');
                    const dayTasks = (groupedTasks[dateKey] || []).sort(compareTasks);
                    const displayLabel = formatGroupLabel(date);
                    const isAddingThisDate = addingDate === isoKey;

                    return (
                        <section key={dateKey} className="group/section">
                            <header className="flex items-center justify-between py-2 px-1 border-b border-border/50 mb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                                <div className="flex items-center gap-3">
                                    <h3 className={`text-sm font-bold tracking-tight lowercase first-letter:uppercase ${dayTasks.length > 0 ? 'text-foreground/90' : 'text-muted-foreground/50'}`}>
                                        {displayLabel}
                                    </h3>
                                    {dayTasks.length > 0 && (
                                        <>
                                            <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                                            <span className="text-[10px] font-medium text-muted-foreground/40">
                                                {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {!isAddingThisDate && (
                                    <button
                                        onClick={() => setAddingDate(isoKey)}
                                        className="opacity-0 group-hover/section:opacity-100 p-1 hover:bg-muted rounded-md transition-all text-muted-foreground hover:text-primary"
                                        title="Add task"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </header>

                            <div className="space-y-1">
                                {isAddingThisDate && (
                                    <div className="mt-2 mb-6 px-1">
                                        <TaskForm
                                            onSave={handleSaveTask}
                                            onCancel={() => setAddingDate(null)}
                                        />
                                    </div>
                                )}

                                <TaskList
                                    tasks={dayTasks}
                                    isLoading={false}
                                    hideAddButton={true}
                                />

                                {dayTasks.length === 0 && !isAddingThisDate && (
                                    <div
                                        onClick={() => setAddingDate(isoKey)}
                                        className="py-6 px-4 rounded-2xl border border-dashed border-border/20 text-center group/empty transition-all hover:border-primary/20 hover:bg-primary/5 cursor-pointer mb-2"
                                    >
                                        <p className="text-[11px] text-muted-foreground/30 group-hover/empty:text-primary/60 transition-colors">
                                            No tasks scheduled. Click to add one.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>

            {!hasAnyUpcomingTasks && !isLoading && (
                <div className="mt-12 py-16 px-4 bg-muted/30 rounded-[2rem] text-center border border-border/50 animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm ring-1 ring-border/50">
                        <CalendarDays className="w-8 h-8 text-indigo-500/40" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Your week looks clear!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8">
                        No tasks scheduled for the next 7 days. Take some time to plan your upcoming goals or enjoy the breathing room.
                    </p>
                    <Button
                        variant="default"
                        size="sm"
                        className="rounded-full shadow-premium"
                        onClick={() => setAddingDate(format(startDate, 'yyyy-MM-dd'))}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule first task
                    </Button>
                </div>
            )}

            <div className="mt-16 pt-10 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground/60 italic max-w-sm mx-auto leading-relaxed">
                    Looking further ahead? You can view all tasks by date in the calendar view coming soon in a future sprint.
                </p>
            </div>
        </div>
    );
};
