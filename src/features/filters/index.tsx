import { Filter, Plus, Sparkles, MoreHorizontal, LayoutGrid, CheckCircle2, Clock, Star } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { IconButton } from '../../components/common/IconButton';

const PLACEHOLDER_FILTERS = [
    { id: 'f1', name: 'Assigned to me', icon: LayoutGrid, color: 'bg-blue-500', count: 12 },
    { id: 'f2', name: 'Priority 1', icon: Star, color: 'bg-red-500', count: 3 },
    { id: 'f3', name: 'Completed Recently', icon: CheckCircle2, color: 'bg-emerald-500', count: 45 },
    { id: 'f4', name: 'No Due Date', icon: Clock, color: 'bg-slate-500', count: 8 },
];

export const Filters = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
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

                <Button size="sm" className="rounded-xl shadow-premium px-4">
                    <Plus className="w-4 h-4 mr-2" />
                    New Filter
                </Button>
            </header>

            <div className="space-y-6">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-4 px-2">System Filters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PLACEHOLDER_FILTERS.map((filter) => (
                            <div
                                key={filter.id}
                                className="group p-4 bg-background border border-border/50 rounded-2xl hover:shadow-premium hover:border-primary/20 transition-all duration-300 flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${filter.color} text-white flex items-center justify-center shadow-sm`}>
                                        <filter.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {filter.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {filter.count} results found
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <IconButton icon={MoreHorizontal} size="sm" title="Filter options" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-12">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-4 px-2">Custom Filters</h3>
                    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/5 text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            <Plus className="w-8 h-8 text-primary/40" />
                        </div>
                        <h4 className="text-xl font-bold mb-2">Build your perfect view</h4>
                        <p className="text-muted-foreground text-sm max-w-sm mb-8">
                            Combine projects, priorities, and dates to create powerful filters.
                        </p>
                        <Button variant="outline" size="sm" className="rounded-xl h-10 px-6">
                            Create custom filter
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};
