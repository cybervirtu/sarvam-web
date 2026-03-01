import { Filter, Plus, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Filters = () => {
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Filters & Labels</h2>
                    <Sparkles className="w-5 h-5 text-primary/40 animate-pulse" />
                </div>
                <p className="text-muted-foreground/80 text-base max-w-2xl leading-relaxed text-balance">
                    Create custom views to focus on what matters. Use filters to slice your data by priority,
                    labels, or due dates.
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border border-border/50 rounded-[2rem] p-16 text-center bg-gradient-to-b from-muted/5 to-transparent relative overflow-hidden group">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-3xl bg-background shadow-premium flex items-center justify-center mb-8 border border-border group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Filter className="w-10 h-10 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 tracking-tight">Your workflow, your way</h3>
                    <p className="text-muted-foreground/70 max-w-md mb-10 text-lg leading-snug text-balance">
                        Filters let you build the perfect setup for your daily routine. Start by creating your first custom view.
                    </p>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="px-6 h-11 rounded-xl">
                            View Documentation
                        </Button>
                        <Button className="gap-2 px-6 h-11 rounded-xl shadow-premium">
                            <Plus className="w-4 h-4" />
                            Create Filter
                        </Button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
};
