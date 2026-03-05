import { useEffect, useState } from 'react';
import { useTaskStore, useProjectStore } from '../../app/store';
import { TaskItem } from '../../components/tasks/TaskItem';
import { isToday, isOverdue } from '../../utils/date';
import { Calendar, CheckCircle2, ListFilter, MoreHorizontal, AlertCircle, Plus } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';
import { TaskForm } from '../../components/tasks/TaskForm';
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

    const todayStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Filter tasks
    const activeTasks = tasks.filter(t => !t.completed).sort((a, b) => (a.order || 0) - (b.order || 0));
    const overdueTasks = activeTasks.filter(t => t.due?.date && isOverdue(t.due.date));
    const todayTasks = activeTasks.filter(t => t.due?.date && isToday(t.due.date));

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading your day...</div>
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
                    <TaskForm
                        onSave={handleSaveTask}
                        onCancel={() => setIsAdding(false)}
                    />
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group w-full px-4 py-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10"
                    >
                        <Plus className="w-4 h-4 text-primary transition-transform group-hover:scale-125 duration-300" />
                        <span className="font-medium">Add task</span>
                    </button>
                )}
            </div>

            <div className="space-y-12">
                {/* Overdue Section */}
                {overdueTasks.length > 0 && (
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 px-1 text-red-500">
                            <AlertCircle className="w-4 h-4" />
                            <h3 className="text-sm font-bold tracking-tight uppercase">Overdue</h3>
                        </div>
                        <div className="space-y-1">
                            {overdueTasks.map(task => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Today Section */}
                <section className="space-y-3">
                    {overdueTasks.length > 0 && (
                        <div className="px-1 border-b border-border/50 pb-2">
                            <h3 className="text-sm font-bold tracking-tight text-foreground/70 uppercase">Today</h3>
                        </div>
                    )}

                    <div className="space-y-1">
                        {todayTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>

                    {todayTasks.length === 0 && overdueTasks.length === 0 && !isAdding && (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="relative">
                                <CheckCircle2 className="w-20 h-20 text-emerald-500/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce-subtle" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">All clear for today!</h3>
                                <p className="text-muted-foreground text-sm max-w-xs">
                                    You've completed all your tasks for today. Enjoy your productive momentum!
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-6"
                                onClick={() => setIsAdding(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add a new task
                            </Button>
                        </div>
                    )}
                </section>
            </div>

        </div>
    );
};
