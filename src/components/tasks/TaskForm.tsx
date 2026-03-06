import { useState, useRef, useEffect } from 'react';
import { Flag, CornerDownLeft, Hash } from 'lucide-react';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { cn } from '../../lib/utils';
import { Priority } from '../../types';
import { PRIORITY_OPTIONS, AVAILABLE_LABELS } from './constants';
import { DatePicker } from '../common/DatePicker';

interface TaskFormProps {
    onSave: (task: {
        title: string;
        description?: string;
        priority: Priority;
        due?: { date: string; isRecurring: boolean } | null;
        labels?: string[];
    }) => void;
    onCancel: () => void;
    initialTitle?: string;
    initialDueDate?: { date: string; isRecurring: boolean } | null;
    initialPriority?: Priority;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    onSave,
    onCancel,
    initialTitle = '',
    initialDueDate = null,
    initialPriority = 4
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>(initialPriority);
    const [dueDate, setDueDate] = useState<string | null>(initialDueDate?.date || null);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            due: dueDate ? { date: dueDate, isRecurring: false } : null,
            labels: selectedLabels,
        });

        setTitle('');
        setDescription('');
        setPriority(4);
        setDueDate(null);
        setSelectedLabels([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div data-testid="task-form" className="bg-background border border-border rounded-2xl p-4 shadow-premium animate-in fade-in zoom-in-95 duration-200 ring-1 ring-primary/5">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    data-testid="task-title-input"
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Task name"
                    className="w-full bg-transparent border-none outline-none text-base font-medium placeholder:text-muted-foreground/40 text-foreground"
                />

                <textarea
                    data-testid="task-desc-input"
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full bg-transparent border-none outline-none text-sm text-muted-foreground placeholder:text-muted-foreground/30 resize-none min-h-[60px]"
                />

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2">
                        <DatePicker
                            value={dueDate}
                            onChange={(val) => setDueDate(val)}
                            placeholder="Due date"
                            className="h-8 px-3 rounded-lg border border-border/40 hover:bg-muted"
                        />

                        <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/20">
                            {PRIORITY_OPTIONS.map((opt) => (
                                <IconButton
                                    key={opt.value}
                                    icon={Flag}
                                    type="button"
                                    onClick={() => setPriority(opt.value)}
                                    className={cn(
                                        "h-7 w-7 rounded-md transition-all duration-200",
                                        priority === opt.value
                                            ? cn("bg-background shadow-sm", opt.color)
                                            : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-background/50"
                                    )}
                                    title={opt.label}
                                    aria-label={`Select ${opt.label}`}
                                    aria-pressed={priority === opt.value}
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {AVAILABLE_LABELS.map((label: { id: string; name: string }) => {
                                const isActive = selectedLabels.includes(label.id);
                                return (
                                    <button
                                        key={label.id}
                                        type="button"
                                        onClick={() => setSelectedLabels((prev: string[]) =>
                                            isActive ? prev.filter((id: string) => id !== label.id) : [...prev, label.id]
                                        )}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10 text-primary border-primary/20"
                                                : "bg-muted/30 text-muted-foreground/60 border-transparent hover:border-border/50"
                                        )}
                                    >
                                        <Hash className="w-2.5 h-2.5 opacity-50" />
                                        {label.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className="h-8 px-4 rounded-lg text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Button>
                        <Button
                            data-testid="task-save-btn"
                            type="submit"
                            disabled={!title.trim()}
                            size="sm"
                            className="h-8 px-4 rounded-lg bg-primary text-primary-foreground shadow-soft hover:shadow-premium transition-all duration-300 gap-2"
                        >
                            <span>Add task</span>
                            <CornerDownLeft className="w-3 h-3 opacity-50" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
