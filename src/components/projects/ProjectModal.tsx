import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { Project } from '../../types';
import { cn } from '../../lib/utils';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, color: string) => void;
    initialProject?: Project;
}

const COLORS = [
    { name: 'Berry Red', value: '#b8255f' },
    { name: 'Red', value: '#db4035' },
    { name: 'Orange', value: '#ff9933' },
    { name: 'Yellow', value: '#fad000' },
    { name: 'Olive Green', value: '#afb83b' },
    { name: 'Lime Green', value: '#7ecc49' },
    { name: 'Green', value: '#299438' },
    { name: 'Mint Green', value: '#6accbc' },
    { name: 'Teal', value: '#158fad' },
    { name: 'Sky Blue', value: '#14aaf5' },
    { name: 'Light Blue', value: '#96c3eb' },
    { name: 'Blue', value: '#4073ff' },
    { name: 'Grape', value: '#884dff' },
    { name: 'Violet', value: '#af38eb' },
    { name: 'Lavender', value: '#eb96eb' },
    { name: 'Magenta', value: '#e05194' },
    { name: 'Salmon', value: '#ff8d85' },
    { name: 'Charcoal', value: '#808080' },
    { name: 'Grey', value: '#b8b8b8' },
    { name: 'Taupe', value: '#ccac93' },
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialProject
}) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLORS[17].value); // Charcoal default

    useEffect(() => {
        if (initialProject) {
            setName(initialProject.name);
            setColor(initialProject.color);
        } else {
            setName('');
            setColor(COLORS[17].value);
        }
    }, [initialProject, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim(), color);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-muted/30 border border-border/50 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                    <h3 className="text-lg font-bold">
                        {initialProject ? 'Edit Project' : 'Add Project'}
                    </h3>
                    <IconButton icon={X} onClick={onClose} size="sm" />
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="project-name" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Name
                        </label>
                        <input
                            id="project-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name..."
                            autoFocus
                            className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                            Color
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    title={c.name}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm",
                                        color === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : ""
                                    )}
                                    style={{ backgroundColor: c.value }}
                                >
                                    {color === c.value && <Check className="w-4 h-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-8"
                        >
                            {initialProject ? 'Save Changes' : 'Add Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
