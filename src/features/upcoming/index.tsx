import { useEffect } from 'react';
import { useTaskStore, useProjectStore } from '../../app/store';
import { TaskItem } from '../../components/tasks/TaskItem';
import { getNext7Days, formatDisplayDate } from '../../utils/date';
import { CalendarDays, ListFilter, MoreHorizontal, ChevronRight } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';

export const Upcoming = () => {
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const { projects, fetchProjectsAndLabels } = useProjectStore();

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks();
        }
        if (projects.length === 0) {
            fetchProjectsAndLabels();
        }
    }, [tasks.length, projects.length, fetchTasks, fetchProjectsAndLabels]);

    const next7Days = getNext7Days();
    const activeTasks = tasks.filter(t => !t.completed);

    // Group tasks by date
    const tasksByDate = next7Days.reduce((acc, date) => {
        acc[date] = activeTasks.filter(t => t.due?.date === date);
        return acc;
    }, {} as Record<string, typeof tasks>);

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading upcoming weeks...</div>
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

            <div className="space-y-8">
                {next7Days.map((date) => {
                    const dayTasks = tasksByDate[date] || [];
                    const displayDate = formatDisplayDate(date);

                    return (
                        <section key={date} className="group/section">
                            <header className="flex items-center gap-3 py-2 px-1 border-b border-border/50 mb-3 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                                <h3 className="text-sm font-bold tracking-tight text-foreground/80 lowercase first-letter:uppercase">
                                    {displayDate}
                                </h3>
                                <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                                <span className="text-[10px] font-medium text-muted-foreground/40">
                                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                                </span>
                            </header>

                            <div className="space-y-1">
                                {dayTasks.map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}

                                {dayTasks.length === 0 && (
                                    <div className="py-6 px-4 rounded-2xl border border-dashed border-border/40 text-center group/empty transition-all hover:border-primary/20 hover:bg-primary/5 cursor-pointer">
                                        <p className="text-xs text-muted-foreground/40 group-hover/empty:text-primary/60 transition-colors">
                                            No tasks scheduled. Click to add one.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground italic max-w-xs mx-auto">
                    Looking further ahead? You can view all tasks by date in the calendar view coming soon.
                </p>
            </div>
        </div>
    );
};
