export const Labels = () => {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-1">Labels</h2>
                <p className="text-muted-foreground text-sm">
                    Tag and categorize your tasks with custom labels.
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-3xl p-12 text-center bg-muted/5">
                <div className="p-4 border border-border rounded-xl bg-muted/10 text-muted-foreground min-w-[200px]">
                    Labels feature coming soon...
                </div>
            </div>
        </div>
    );
};
