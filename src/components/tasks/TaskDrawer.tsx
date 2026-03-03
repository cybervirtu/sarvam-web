import { useEffect, useState } from 'react';
import { X, Calendar, Flag, Hash, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useTaskStore, useUIStore } from '../../app/store';
import { IconButton } from '../common/IconButton';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { Priority } from '../../types';

export const TaskDrawer = () => {
    const { activeTaskId, closeTaskDrawer } = useUIStore();
    const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();

    const task = tasks.find(t => t.id === activeTaskId);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
        }
    }, [task]);

    if (!activeTaskId || !task) return null;

    const handleTitleBlur = () => {
        if (title.trim() !== task.title) {
            updateTask(task.id, { title: title.trim() });
        }
    };

    const handleDescriptionBlur = () => {
        if (description !== task.description) {
            updateTask(task.id, { description });
        }
    };

    const handlePriorityChange = (priority: Priority) => {
        updateTask(task.id, { priority });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
            closeTaskDrawer();
        }
    };

    const priorityOptions: { value: Priority; label: string; color: string }[] = [
        { value: 1, label: 'Priority 1', color: 'text-red-500' },
        { value: 2, label: 'Priority 2', color: 'text-orange-500' },
        { value: 3, label: 'Priority 3', color: 'text-blue-500' },
        { value: 4, label: 'Priority 4', color: 'text-muted-foreground/40' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/40 backdrop-blur-[2px] z-40 animate-in fade-in duration-300"
                onClick={closeTaskDrawer}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-[450px] bg-background border-l border-border shadow-premium z-50 animate-in slide-in-from-right duration-500 ease-out flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => toggleTaskCompletion(task.id)}
                        >
                            {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                                <Circle className="w-5 h-5" />
                            )}
                            <span className="ml-2 text-xs font-medium uppercase tracking-wider">
                                {task.completed ? 'Completed' : 'Mark Complete'}
                            </span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <IconButton icon={Trash2} onClick={handleDelete} title="Delete Task" className="text-muted-foreground hover:text-red-500" />
                        <IconButton icon={X} onClick={closeTaskDrawer} title="Close" />
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Title */}
                    <div className="space-y-1">
                        <textarea
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            placeholder="Task title"
                            className="w-full bg-transparent border-none outline-none text-2xl font-bold placeholder:text-muted-foreground/30 resize-none min-h-[40px] leading-tight"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <span>Description</span>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescriptionBlur}
                            placeholder="Add a detailed description..."
                            className="w-full bg-muted/30 border border-transparent focus:border-border/50 rounded-xl p-4 outline-none text-sm leading-relaxed min-h-[150px] transition-all"
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Priority</span>
                            <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/20 w-fit">
                                {priorityOptions.map((opt) => (
                                    <IconButton
                                        key={opt.value}
                                        icon={Flag}
                                        onClick={() => handlePriorityChange(opt.value)}
                                        className={cn(
                                            "h-8 w-8 rounded-lg transition-all duration-200",
                                            task.priority === opt.value
                                                ? cn("bg-background shadow-sm", opt.color)
                                                : "text-muted-foreground/30 hover:text-muted-foreground"
                                        )}
                                        title={opt.label}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Due Date</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full h-10 justify-start gap-3 rounded-xl border-border/40 hover:bg-muted text-xs font-medium"
                            >
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{task.due?.date || 'Set due date'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Hash className="w-3.5 h-3.5" />
                            <span>Labels</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {task.labels.map(labelId => (
                                <div key={labelId} className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/10">
                                    <Hash className="w-3 h-3" />
                                    {labelId}
                                </div>
                            ))}
                            <button className="flex items-center gap-1.5 border border-dashed border-border/60 text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hover:border-primary/40 hover:text-primary transition-all">
                                <span>Add label</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="p-4 border-t border-border/50 bg-muted/10 text-[10px] text-muted-foreground flex justify-between">
                    <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                    <span>Last updated {new Date(task.updatedAt).toLocaleTimeString()}</span>
                </footer>
            </div>
        </>
    );
};
