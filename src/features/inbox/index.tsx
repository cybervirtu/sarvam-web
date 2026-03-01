import { useEffect } from 'react';
import { useTaskStore } from '../../app/store';
import { TaskList } from '../../components/tasks/TaskList';
import { ListFilter, LayoutGrid } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';

export const Inbox = () => {
    const { tasks, isLoading, fetchTasks } = useTaskStore();

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks();
        }
    }, []);

    const handleAddTask = () => {
        // Placeholder for add task logic
        console.log('Add task clicked');
    };

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

            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                emptyMessage="No tasks in your inbox. Relax!"
                onAddTask={handleAddTask}
            />
        </div>
    );
};
