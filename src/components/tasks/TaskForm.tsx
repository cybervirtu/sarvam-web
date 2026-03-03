import { useState, useRef, useEffect } from 'react';
import { Flag, CornerDownLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { cn } from '../../lib/utils';
import { Priority } from '../../types';
import { PRIORITY_OPTIONS } from './constants';
import { DatePicker } from '../common/DatePicker';

interface TaskFormProps {
    onSave: (task: { title: string; description?: string; priority: Priority; due?: { date: string; isRecurring: boolean } | null }) => void;
    onCancel: () => void;
    initialTitle?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, initialTitle = '' }) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>(4);
    const [dueDate, setDueDate] = useState<string | null>(null);
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
        });

        setTitle('');
        setDescription('');
        setPriority(4);
        setDueDate(null);
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
        <div className="bg-background border border-border rounded-2xl p-4 shadow-premium animate-in fade-in zoom-in-95 duration-200 ring-1 ring-primary/5">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Task name"
                    className="w-full bg-transparent border-none outline-none text-base font-medium placeholder:text-muted-foreground/40 text-foreground"
                />

                <textarea
                    value={description}
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
