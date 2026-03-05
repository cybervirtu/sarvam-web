import { useEffect, useState } from 'react';
import { X, Flag, Hash, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useTaskStore, useUIStore, useProjectStore } from '../../app/store';
import { IconButton } from '../common/IconButton';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { Priority, Project, Section } from '../../types';
import { PRIORITY_OPTIONS, AVAILABLE_LABELS } from './constants';
import { DatePicker } from '../common/DatePicker';

export const TaskDrawer = () => {
    const { activeTaskId, closeTaskDrawer } = useUIStore();
    const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();
    const { projects, getSectionsByProject } = useProjectStore();

    const task = tasks.find(t => t.id === activeTaskId);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [availableSections, setAvailableSections] = useState<Section[]>([]);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setIsConfirmingDelete(false);
            if (task.projectId) {
                setAvailableSections(getSectionsByProject(task.projectId));
            } else {
                setAvailableSections([]);
            }
        }
    }, [task, getSectionsByProject]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeTaskDrawer();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeTaskDrawer]);

    if (!activeTaskId || !task) return null;

    const handleTitleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value.trim();
        if (newTitle !== task.title) {
            updateTask(task.id, { title: newTitle });
        }
    };

    const handleDescriptionBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const newDesc = e.target.value;
        if (newDesc !== task.description) {
            updateTask(task.id, { description: newDesc });
        }
    };

    const handlePriorityChange = (priority: Priority) => {
        updateTask(task.id, { priority });
    };

    const confirmDelete = () => {
        deleteTask(task.id);
        closeTaskDrawer();
    };

    const toggleLabel = (labelId: string) => {
        const newLabels = task.labels.includes(labelId)
            ? task.labels.filter(id => id !== labelId)
            : [...task.labels, labelId];
        updateTask(task.id, { labels: newLabels });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/40 backdrop-blur-[2px] z-40 animate-in fade-in duration-300"
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeTaskDrawer();
                }}
            />

            {/* Drawer */}
            <div
                data-testid="task-drawer"
                className="fixed right-0 top-0 h-full w-[450px] bg-background border-l border-border shadow-premium z-50 animate-in slide-in-from-right duration-500 ease-out flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
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
                        {isConfirmingDelete ? (
                            <div className="flex items-center gap-2 bg-destructive/10 px-3 py-1.5 rounded-lg border border-destructive/20 animate-in fade-in zoom-in-95 duration-200">
                                <span className="text-xs font-medium text-destructive whitespace-nowrap">Delete task?</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs hover:bg-destructive/20 text-destructive"
                                    onClick={confirmDelete}
                                >
                                    Yes
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs hover:bg-muted text-muted-foreground"
                                    onClick={() => setIsConfirmingDelete(false)}
                                >
                                    No
                                </Button>
                            </div>
                        ) : (
                            <>
                                <IconButton icon={Trash2} onClick={() => setIsConfirmingDelete(true)} title="Delete Task" className="text-muted-foreground hover:text-red-500" />
                                <IconButton icon={X} onClick={closeTaskDrawer} title="Close" />
                            </>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Title */}
                    <div className="space-y-1">
                        <textarea
                            data-testid="task-drawer-title"
                            value={title || ''}
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
                            data-testid="task-drawer-desc"
                            value={description || ''}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleDescriptionBlur}
                            placeholder="Add a detailed description..."
                            className="w-full bg-muted/30 border border-transparent focus:border-border/50 rounded-xl p-4 outline-none text-sm leading-relaxed min-h-[150px] transition-all"
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Project</span>
                            <select
                                data-testid="task-project-select"
                                value={task.projectId || ''}
                                onChange={(e) => {
                                    const newProjectId = e.target.value;
                                    updateTask(task.id, { projectId: newProjectId, sectionId: null });
                                }}
                                className="w-full h-10 rounded-xl border border-border/40 hover:bg-muted px-3 transition-colors text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer appearance-none"
                            >
                                <option value="" disabled>Select Project</option>
                                {projects.map((p: Project) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Section</span>
                            <select
                                data-testid="task-section-select"
                                value={task.sectionId || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    updateTask(task.id, { sectionId: val === '' ? null : val });
                                }}
                                disabled={!task.projectId || availableSections.length === 0}
                                className="w-full h-10 rounded-xl border border-border/40 hover:bg-muted px-3 transition-colors text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">No Section</option>
                                {availableSections.map((s: Section) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Priority</span>
                            <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/20 w-fit">
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <IconButton
                                        data-testid={`priority-btn-${opt.value}`}
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
                                        aria-label={`Set ${opt.label}`}
                                        aria-pressed={task.priority === opt.value}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Due Date</span>
                            <DatePicker
                                value={task.due?.date || null}
                                onChange={(val) => {
                                    updateTask(task.id, { due: val ? { date: val, isRecurring: false } : null });
                                }}
                                className="w-full h-10 rounded-xl border border-border/40 hover:bg-muted px-3 transition-colors text-xs"
                            />
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Hash className="w-3.5 h-3.5" />
                            <span>Labels</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_LABELS.map(label => {
                                const isActive = task.labels.includes(label.id);
                                return (
                                    <button
                                        data-testid={`label-btn-${label.name}`}
                                        key={label.id}
                                        onClick={() => toggleLabel(label.id)}
                                        aria-pressed={isActive}
                                        aria-label={`Toggle label ${label.name}`}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                                                : "bg-muted/30 text-muted-foreground border-transparent hover:border-border/50 hover:bg-muted/50"
                                        )}
                                    >
                                        <Hash className="w-3 h-3 opacity-70" />
                                        {label.name}
                                    </button>
                                );
                            })}
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
