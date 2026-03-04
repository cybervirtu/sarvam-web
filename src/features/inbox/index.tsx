import { useEffect, useState } from 'react';
import { useTaskStore, useProjectStore } from '../../app/store';
import { TaskList } from '../../components/tasks/TaskList';
import { ListFilter, LayoutGrid, Plus } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { TaskForm } from '../../components/tasks/TaskForm';
import { Priority } from '../../types';

export const Inbox = () => {
    const { projects, fetchProjectsAndLabels, isLoading: isProjectLoading } = useProjectStore();
    const { tasks, isLoading: isTasksLoading, fetchTasks, getInboxTasks, addTask } = useTaskStore();
    const inboxTasks = getInboxTasks();
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (projects.length === 0) {
            fetchProjectsAndLabels();
        }
        if (tasks.length === 0) {
            fetchTasks();
        }
    }, [projects.length, tasks.length, fetchProjectsAndLabels, fetchTasks]);

    const handleSaveTask = (taskData: { title: string; description?: string; priority: Priority; labels?: string[] }) => {
        const { getInboxProjectId } = useProjectStore.getState();
        addTask({
            ...taskData,
            projectId: getInboxProjectId() || 'p1',
        });
        setIsAdding(false);
    };

    if ((isProjectLoading && projects.length === 0) || (isTasksLoading && tasks.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading inbox...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Inbox</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        All your tasks in one place.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <IconButton icon={ListFilter} title="View Options" />
                    <IconButton icon={LayoutGrid} title="Board View" />
                </div>
            </header>

            <div className="mb-6">
                {isAdding ? (
                    <TaskForm
                        onSave={handleSaveTask}
                        onCancel={() => setIsAdding(false)}
                    />
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-border/50"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-muted-foreground/60 group-hover:text-primary transition-colors">
                            Add task
                        </span>
                    </button>
                )}
            </div>

            <TaskList
                tasks={inboxTasks}
                isLoading={isTasksLoading}
                emptyMessage="No tasks in your inbox. Relax!"
                hideAddButton={true}
            />
        </div>
    );
};
