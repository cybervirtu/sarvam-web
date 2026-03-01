import { useEffect, useState } from 'react';
import { Task } from '../../types';
import { getTasks } from '../../services/mocks';
import { TaskItem } from '../../components/tasks/TaskItem';
import { Plus, ListFilter, LayoutGrid, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { IconButton } from '../../components/common/IconButton';

export const Inbox = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

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

            <div className="space-y-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-sm font-medium">Crunching your tasks...</span>
                    </div>
                ) : tasks.length > 0 ? (
                    <>
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}

                        <button className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 mt-2 group">
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-muted-foreground/60 group-hover:text-primary transition-colors">
                                Add task
                            </span>
                        </button>
                    </>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60 mt-4">
                        <p className="text-sm text-muted-foreground">No tasks in your inbox. Relax!</p>
                        <Button className="mt-4 gap-2 shadow-soft">
                            <Plus className="w-4 h-4" />
                            Create Task
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
