import { Filter, Plus, Sparkles, MoreHorizontal, ChevronRight, X } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { IconButton } from '../../components/common/IconButton';
import { useFilterStore, useTaskStore, useProjectStore } from '../../app/store';
import { evaluateFilter } from '../../utils/filters';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FilterCriteria, FilterCriteriaKind } from '../../types';

export const Filters = () => {
    const { filters, addFilter } = useFilterStore();
    const { tasks } = useTaskStore();
    const { projects } = useProjectStore();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [kind, setKind] = useState<FilterCriteriaKind>('priority');
    const [value, setValue] = useState<string | number | boolean>('1');

    const handleCreate = () => {
        if (!name.trim()) return;

        const criteria: FilterCriteria[] = [{
            kind,
            value: kind === 'priority' ? Number(value) : value
        }];

        addFilter(name, criteria);
        setIsModalOpen(false);
        setName('');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-premium ring-1 ring-primary/20">
                        <Filter className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">Filters</h2>
                            <Sparkles className="w-4 h-4 text-primary/40 animate-pulse" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Custom views for your unique workflow</p>
                    </div>
                </div>

                <Button size="sm" className="rounded-xl shadow-premium px-4" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Filter
                </Button>
            </header>

            <div className="space-y-6">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-4 px-2">Your Filters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filters.map((filter) => {
                            const matchCount = evaluateFilter(tasks, filter.criteria).length;
                            return (
                                <div
                                    key={filter.id}
                                    onClick={() => navigate(`/filters/${filter.id}`)}
                                    className="group p-4 bg-background border border-border/50 rounded-2xl hover:shadow-premium hover:border-primary/20 transition-all duration-300 flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${filter.color || 'bg-slate-500'} text-white flex items-center justify-center shadow-sm`}>
                                            <Filter className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {filter.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {matchCount} {matchCount === 1 ? 'task' : 'tasks'} found
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IconButton
                                                icon={MoreHorizontal}
                                                size="sm"
                                                title="Filter options"
                                                onClick={(e) => { e.stopPropagation(); /* Options */ }}
                                            />
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {filters.length === 0 && (
                    <section className="mt-12">
                        <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/5 text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                <Plus className="w-8 h-8 text-primary/40" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Build your perfect view</h4>
                            <p className="text-muted-foreground text-sm max-w-sm mb-8">
                                Combine projects, priorities, and dates to create powerful filters.
                            </p>
                            <Button variant="outline" size="sm" className="rounded-xl h-10 px-6" onClick={() => setIsModalOpen(true)}>
                                Create custom filter
                            </Button>
                        </div>
                    </section>
                )}
            </div>

            {/* Simple Modal Backdrop */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-background border border-border rounded-[2rem] shadow-premium p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">New Filter</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2 block">Filter Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Critical Bugs"
                                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2 block">Criterion Type</label>
                                    <select
                                        value={kind}
                                        onChange={(e) => setKind(e.target.value as any)}
                                        className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                    >
                                        <option value="priority">Priority</option>
                                        <option value="due">Due Date</option>
                                        <option value="project">Project</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2 block">Value</label>
                                    {kind === 'priority' && (
                                        <select
                                            value={String(value)}
                                            onChange={(e) => setValue(e.target.value)}
                                            className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                        >
                                            <option value="1">P1 - Critical</option>
                                            <option value="2">P2 - High</option>
                                            <option value="3">P3 - Medium</option>
                                            <option value="4">P4 - Low</option>
                                        </select>
                                    )}
                                    {kind === 'due' && (
                                        <select
                                            value={String(value)}
                                            onChange={(e) => setValue(e.target.value)}
                                            className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                        >
                                            <option value="today">Due Today</option>
                                            <option value="overdue">Overdue</option>
                                            <option value="next7days">Next 7 Days</option>
                                        </select>
                                    )}
                                    {kind === 'project' && (
                                        <select
                                            value={String(value)}
                                            onChange={(e) => setValue(e.target.value)}
                                            className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                                        >
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="flex-1 rounded-xl h-11 shadow-premium" onClick={handleCreate}>
                                    Create Filter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export * from './FilterResults';
