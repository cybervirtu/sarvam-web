import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Flag, CornerDownLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { cn } from '../../lib/utils';
import { Priority } from '../../types';

interface TaskFormProps {
    onSave: (task: { title: string; priority: Priority; due?: string }) => void;
    onCancel: () => void;
    initialTitle?: string;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 1, label: 'Priority 1', color: 'text-red-500' },
    { value: 2, label: 'Priority 2', color: 'text-orange-500' },
    { value: 3, label: 'Priority 3', color: 'text-blue-500' },
    { value: 4, label: 'Priority 4', color: 'text-muted-foreground/40' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, initialTitle = '' }) => {
    const [title, setTitle] = useState(initialTitle);
    const [priority, setPriority] = useState<Priority>(4);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            priority,
        });

        setTitle('');
        setPriority(4);
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
                    placeholder="Description"
                    className="w-full bg-transparent border-none outline-none text-sm text-muted-foreground placeholder:text-muted-foreground/30 resize-none min-h-[60px]"
                />

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs gap-2 rounded-lg border-border/40 hover:bg-muted"
                        >
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>Due date</span>
                        </Button>

                        <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/20">
                            {priorityOptions.map((opt) => (
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
