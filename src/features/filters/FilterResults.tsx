import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore, useFilterStore } from '../../app/store';
import { TaskList } from '../../components/tasks/TaskList';
import { evaluateFilter } from '../../utils/filters';
import { Filter, ArrowLeft, MoreHorizontal, ListFilter } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';

export const FilterResults = () => {
    const { filterId } = useParams<{ filterId: string }>();
    const navigate = useNavigate();
    const { tasks, isLoading: tasksLoading } = useTaskStore();
    const { getFilterById } = useFilterStore();

    const filter = filterId ? getFilterById(filterId) : undefined;

    if (!filter) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <p className="text-muted-foreground text-lg italic">Filter not found</p>
                <Button variant="outline" onClick={() => navigate('/filters')}>
                    Back to Filters
                </Button>
            </div>
        );
    }

    const filteredTasks = evaluateFilter(tasks, filter.criteria);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/filters')}
                        className="w-10 h-10 rounded-xl bg-muted py-2 px-2 hover:bg-muted/80 transition-colors flex items-center justify-center text-muted-foreground mr-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className={`w-12 h-12 rounded-2xl ${filter.color || 'bg-primary/10'} text-white flex items-center justify-center shadow-premium ring-1 ring-primary/20`}>
                        <Filter className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{filter.name}</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <IconButton icon={ListFilter} title="View Options" />
                    <IconButton icon={MoreHorizontal} title="More Actions" />
                </div>
            </header>

            <div className="space-y-6">
                <TaskList
                    tasks={filteredTasks}
                    isLoading={tasksLoading}
                    hideAddButton={true}
                />

                {filteredTasks.length === 0 && !tasksLoading && (
                    <div className="text-center py-20 px-4 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
                        <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm ring-1 ring-border/50">
                            <Filter className="w-8 h-8 text-primary/20" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No matches found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            No tasks currently meet the criteria for "{filter.name}".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
