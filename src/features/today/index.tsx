import { useEffect, useState, useMemo } from 'react';
import { useTaskStore, useProjectStore } from '../../app/store';
import { TaskList } from '../../components/tasks/TaskList';
import { isDueToday, isOverdue, compareTasks } from '../../utils/dates';
import { Calendar, CheckCircle2, ListFilter, MoreHorizontal, Plus, AlertCircle } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';
import { TaskForm } from '../../components/tasks/TaskForm';
import { GroupHeader } from '../../components/tasks/GroupHeader';
import { Priority } from '../../types';

export const Today = () => {
    const { tasks, fetchTasks, isLoading, addTask } = useTaskStore();
    const { projects, fetchProjectsAndLabels } = useProjectStore();
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks();
        }
        if (projects.length === 0) {
            fetchProjectsAndLabels();
        }
    }, [tasks.length, projects.length, fetchTasks, fetchProjectsAndLabels]);

    const handleSaveTask = (taskData: {
        title: string;
        description?: string;
        priority: Priority;
        due?: { date: string; isRecurring: boolean } | null;
        labels?: string[];
    }) => {
        const today = new Date().toISOString().split('T')[0];
        addTask({
            ...taskData,
            due: taskData.due || { date: today, isRecurring: false },
        });
        setIsAdding(false);
    };

    const todayStr = useMemo(() => new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }), []);

    // Memoized filter and sort tasks
    const { overdueTasks, todayTasks, hasNoTasks } = useMemo(() => {
        const activeTasks = tasks.filter(t => !t.completed);

        const overdue = activeTasks
            .filter(t => isOverdue(t))
            .sort(compareTasks);

        const today = activeTasks
            .filter(t => isDueToday(t))
            .sort(compareTasks);

        return {
            overdueTasks: overdue,
            todayTasks: today,
            hasNoTasks: overdue.length === 0 && today.length === 0
        };
    }, [tasks]);

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground font-medium italic">Loading your day...</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-premium ring-1 ring-primary/20">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Today</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{todayStr}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <IconButton icon={ListFilter} title="View Options" />
                    <IconButton icon={MoreHorizontal} title="More Actions" />
                </div>
            </header>

            <div className="mb-8">
                {isAdding ? (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <TaskForm
                            onSave={handleSaveTask}
                            onCancel={() => setIsAdding(false)}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all group w-full px-4 py-3 rounded-xl hover:bg-primary/5 border border-dashed border-border/50 hover:border-primary/20"
                    >
                        <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-4 h-4 text-primary transition-transform group-hover:scale-125 duration-300" />
                        </div>
                        <span className="font-semibold tracking-tight">Add a task due today...</span>
                    </button>
                )}
            </div>

            <div className="space-y-10">
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
                            isLoading={isLoading}
                            hideAddButton={true}
                        />
                    </section>
                )}

                {/* Today Section */}
                <section className="space-y-3 animate-in fade-in duration-700">
                    {overdueTasks.length > 0 && (
                        <GroupHeader
                            label="Today"
                            count={todayTasks.length}
                        />
                    )}

                    <TaskList
                        tasks={todayTasks}
                        isLoading={isLoading}
                        emptyMessage="All clear for today!"
                        hideAddButton={true}
                    />

                    {hasNoTasks && !isLoading && !isAdding && (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-700">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                                <CheckCircle2 className="w-20 h-20 text-emerald-500/10 relative" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce-subtle" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold tracking-tight">Focus on what matters most</h3>
                                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed italic">
                                    Your today's schedule is blooming with potential. What's the one thing you'd love to achieve right now?
                                </p>
                            </div>
                            <Button
                                variant="default"
                                size="sm"
                                className="rounded-2xl px-8 h-11 shadow-premium font-bold tracking-tight"
                                onClick={() => setIsAdding(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create your first goal
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
