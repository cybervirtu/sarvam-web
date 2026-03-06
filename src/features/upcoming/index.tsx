import { useEffect, useState, useMemo } from 'react';
import { useTaskStore, useProjectStore } from '../../app/store';
import { TaskList } from '../../components/tasks/TaskList';
import {
    groupTasksByDueDate,
    formatGroupLabel,
    compareTasks,
    addDays,
    startOfDay,
    isOverdue
} from '../../utils/dates';
import { CalendarDays, ListFilter, MoreHorizontal, Plus, AlertCircle } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';
import { TaskForm } from '../../components/tasks/TaskForm';
import { GroupHeader } from '../../components/tasks/GroupHeader';
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

    const { days, overdueTasks, groupedTasks, hasAnyTasks } = useMemo(() => {
        const now = new Date();
        const start = startOfDay(now);
        const end = addDays(start, 6); // 7 days inclusive
        const activeTasks = tasks.filter(t => !t.completed);

        const overdue = activeTasks
            .filter(t => isOverdue(t))
            .sort(compareTasks);

        const grouped = groupTasksByDueDate(activeTasks, start, end);
        const sevenDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));
        const hasUpcoming = Object.values(grouped).some(group => group.length > 0);

        return {
            days: sevenDays,
            overdueTasks: overdue,
            groupedTasks: grouped,
            hasAnyTasks: overdue.length > 0 || hasUpcoming,
            startDate: start
        };
    }, [tasks]);

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
                <div className="animate-pulse text-muted-foreground font-medium italic">Loading upcoming weeks...</div>
            </div>
        );
    }

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

            <div className="space-y-12">
                {/* Overdue Section */}
                {overdueTasks.length > 0 && (
                    <section className="animate-in slide-in-from-left-2 duration-500">
                        <GroupHeader
                            label="Overdue"
                            icon={AlertCircle}
                            count={overdueTasks.length}
                            variant="overdue"
                        />
                        <TaskList
                            tasks={overdueTasks}
                            isLoading={false}
                            hideAddButton={true}
                        />
                    </section>
                )}

                {/* Grouped Upcoming Tasks */}
                {days.map((date, index) => {
                    const dateKey = format(date, 'dd-MM-yyyy');
                    const isoKey = format(date, 'yyyy-MM-dd');
                    const dayTasks = (groupedTasks[dateKey] || []).sort(compareTasks);
                    const displayLabel = formatGroupLabel(date);
                    const isAddingThisDate = addingDate === isoKey;

                    return (
                        <section key={dateKey} className={`group/section animate-in fade-in duration-500 delay-${(index + 1) * 100}`}>
                            <GroupHeader
                                label={displayLabel}
                                count={dayTasks.length}
                                variant={dayTasks.length > 0 ? 'default' : 'dimmed'}
                                rightElement={
                                    !isAddingThisDate && (
                                        <button
                                            onClick={() => setAddingDate(isoKey)}
                                            className="opacity-0 group-hover/section:opacity-100 p-1.5 hover:bg-primary/10 rounded-lg transition-all text-primary"
                                            title="Add task"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    )
                                }
                            />

                            <div className="space-y-1">
                                {isAddingThisDate && (
                                    <div className="mt-2 mb-6 px-1 animate-in slide-in-from-top-2 duration-300">
                                        <TaskForm
                                            onSave={handleSaveTask}
                                            onCancel={() => setAddingDate(null)}
                                            initialDueDate={{ date: isoKey, isRecurring: false }}
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
                                        className="py-4 px-4 rounded-xl border border-dashed border-border/10 text-center group/empty transition-all hover:border-primary/20 hover:bg-primary/5 cursor-pointer mb-2"
                                    >
                                        <p className="text-[11px] font-medium text-muted-foreground/20 group-hover/empty:text-primary/60 transition-colors uppercase tracking-widest">
                                            No tasks scheduled
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>

            {!hasAnyTasks && !isLoading && (
                <div className="mt-12 py-20 px-4 bg-muted/20 rounded-[2.5rem] text-center border border-border/50 animate-in zoom-in-95 duration-700">
                    <div className="relative mb-8">
                        <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
                        <CalendarDays className="w-20 h-20 text-indigo-500/10 mx-auto relative" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-indigo-500 animate-bounce-subtle" />
                        </div>
                    </div>
                    <div className="space-y-3 mb-10">
                        <h3 className="text-xl font-bold tracking-tight">Your week is an open canvas</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed italic">
                            The next 7 days are completely clear. Why not schedule some time for a passion project or a well-deserved break?
                        </p>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className="rounded-2xl px-10 h-12 shadow-premium font-bold tracking-tight"
                        onClick={() => setAddingDate(format(days[0], 'yyyy-MM-dd'))}
                    >
                        <Plus className="w-5 h-5 mr-3" />
                        Start planning your week
                    </Button>
                </div>
            )}

            <div className="mt-20 pt-10 border-t border-border/30 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground/30 uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                    Extended planning coming soon
                </p>
                <p className="text-xs text-muted-foreground/40 mt-2 italic px-10">
                    Full calendar views and multi-week planning are currently under development.
                </p>
            </div>
        </div>
    );
};
