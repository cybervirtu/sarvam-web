import { useEffect } from 'react';
import { useProjectStore, useTaskStore } from '../../app/store';
import { Tag, Plus, MoreHorizontal, Hash, Search } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';

export const Labels = () => {
    const { labels, fetchProjectsAndLabels, isLoading } = useProjectStore();
    const { tasks, fetchTasks } = useTaskStore();

    useEffect(() => {
        if (labels.length === 0) {
            fetchProjectsAndLabels();
        }
        if (tasks.length === 0) {
            fetchTasks();
        }
    }, [labels.length, tasks.length, fetchProjectsAndLabels, fetchTasks]);

    // Helper to count tasks for a label
    const getTaskCount = (labelId: string) => {
        return tasks.filter(t => t.labels.includes(labelId) && !t.isCompleted).length;
    };

    if (isLoading && labels.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading labels...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-premium ring-1 ring-amber-500/20">
                        <Tag className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Labels</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Organize tasks across projects with tags</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <input
                            type="text"
                            placeholder="Search labels..."
                            className="pl-9 pr-4 py-2 bg-muted/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                        />
                    </div>
                    <Button size="sm" className="rounded-xl shadow-premium px-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Label
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labels.map((label) => {
                    const count = getTaskCount(label.id);
                    return (
                        <div
                            key={label.id}
                            className="group p-4 bg-background border border-border/50 rounded-2xl hover:shadow-premium hover:border-primary/20 transition-all duration-300 flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                                    style={{ backgroundColor: label.color }}
                                >
                                    <Hash className="w-5 h-5 opacity-70" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {label.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {count} active {count === 1 ? 'task' : 'tasks'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <IconButton icon={MoreHorizontal} size="sm" title="Label settings" />
                            </div>
                        </div>
                    );
                })}

                {labels.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 bg-muted/5 rounded-[2.5rem] border-2 border-dashed border-border/50">
                        <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center">
                            <Tag className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold">No labels yet</h3>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Create labels to track similar tasks across different projects.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <Plus className="w-4 h-4 mr-2" />
                            Create your first label
                        </Button>
                    </div>
                )}
            </div>

            <footer className="mt-16 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="font-bold text-foreground">Pro Tip: Multi-tagging</h4>
                        <p className="text-sm text-muted-foreground">
                            You can add multiple labels to a single task to create rich cross-sections of your work, like #urgent and #deep-work.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
