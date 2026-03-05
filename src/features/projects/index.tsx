import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore, useTaskStore } from '../../app/store';
import { SectionList } from '../../components/projects/SectionList';
import { TaskListSortable } from '../../components/tasks/TaskListSortable';
import { ListFilter, LayoutGrid, MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import { IconButton } from '../../components/common/IconButton';
import { Button } from '../../components/common/Button';
import { TaskForm } from '../../components/tasks/TaskForm';
import { ProjectModal } from '../../components/projects/ProjectModal';
import { Priority, Project, Task, Section } from '../../types';

export const Projects = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { projects, sections, fetchProjectsAndLabels, fetchSections, isLoading: isProjectLoading, addProject, updateProject, deleteProject, getInboxProjectId, addSection } = useProjectStore();
    const { tasks, isLoading: isTasksLoading, fetchTasks, addTask, moveTasksToInbox, getTasksBySection, getUnsectionedTasks } = useTaskStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>();
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    useEffect(() => {
        if (projects.length === 0) {
            fetchProjectsAndLabels();
        }
        if (tasks.length === 0) {
            fetchTasks();
        }
    }, [projects.length, tasks.length, fetchProjectsAndLabels, fetchTasks]);

    useEffect(() => {
        if (id) {
            fetchSections(id);
        }
    }, [id, fetchSections]);

    const activeProject = projects.find((p: Project) => p.id === id);
    const projectTasks = tasks.filter((t: Task) => t.projectId === id);

    // Group tasks by section using sorted selectors (memoized for DnD stability)
    const projectSections = useMemo(() =>
        sections.filter((s: Section) => s.projectId === id).sort((a: Section, b: Section) => a.order - b.order),
        [sections, id]
    );

    const tasksBySection = useMemo(() =>
        projectSections.reduce((acc: Record<string, Task[]>, section: Section) => {
            acc[section.id] = getTasksBySection(id!, section.id);
            return acc;
        }, {} as Record<string, Task[]>),
        [projectSections, id, getTasksBySection, tasks]
    );

    // Tasks without a section (sorted & memoized)
    const unsectionedTasks = useMemo(() =>
        id ? getUnsectionedTasks(id) : [],
        [id, getUnsectionedTasks, tasks]
    );

    const handleSaveTask = (taskData: {
        title: string;
        description?: string;
        priority: Priority;
        due?: { date: string; isRecurring: boolean } | null;
        labels?: string[];
    }) => {
        addTask({
            ...taskData,
            projectId: id,
            sectionId: null,
        });
        setIsAdding(false);
    };

    const handleCreateSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSectionName.trim() && activeProject) {
            addSection(activeProject.id, newSectionName.trim());
            setNewSectionName('');
            setIsAddingSection(false);
        }
    };

    if (isProjectLoading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading project...</div>
            </div>
        );
    }

    // Projects Dashboard (if no ID)
    if (!id) {
        return (
            <div className="flex flex-col h-full animate-fade-in">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your work by grouping tasks into projects.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.filter((p: Project) => !p.isInbox).map((project: Project) => (
                        <div
                            key={project.id}
                            className="group p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                                    style={{ backgroundColor: project.color }}
                                >
                                    <span className="font-bold text-lg">{project.name.charAt(0)}</span>
                                </div>
                                <IconButton icon={MoreHorizontal} size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                            <p className="text-xs text-muted-foreground">
                                {tasks.filter((t: Task) => t.projectId === project.id).length} tasks
                            </p>
                        </div>
                    ))}

                    {/* Add Project Card */}
                    <button
                        onClick={() => {
                            setEditingProject(undefined);
                            setIsModalOpen(true);
                        }}
                        className="p-6 rounded-3xl border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center text-center group"
                    >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary">Create New Project</span>
                    </button>
                </div>

                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(name, color) => {
                        if (editingProject) {
                            updateProject(editingProject.id, { name, color });
                        } else {
                            addProject(name, color);
                        }
                    }}
                    initialProject={editingProject}
                />
            </div>
        );
    }

    if (!activeProject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="text-4xl">🏷️</div>
                <h3 className="text-xl font-bold">Project not found</h3>
                <p className="text-muted-foreground">This project doesn't exist or has been deleted.</p>
                <Button variant="outline" onClick={() => navigate('/projects')}>Go to Projects Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-premium"
                        style={{ backgroundColor: activeProject.color }}
                    >
                        {activeProject.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{activeProject.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                                {projectTasks.length} tasks
                            </span>
                            {activeProject.isShared && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Shared</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <IconButton icon={ListFilter} title="View Options" />
                    <IconButton icon={LayoutGrid} title="Board View" />
                    <div className="flex items-center gap-1">
                        <IconButton
                            icon={Pencil}
                            title="Rename Project"
                            onClick={() => {
                                setEditingProject(activeProject);
                                setIsModalOpen(true);
                            }}
                        />
                        {!activeProject.isInbox && (
                            <IconButton
                                icon={Trash2}
                                title="Delete Project"
                                onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${activeProject.name}"? Tasks will be moved to Inbox.`)) {
                                        const inboxId = getInboxProjectId() || 'p1';
                                        moveTasksToInbox(activeProject.id, inboxId);
                                        deleteProject(activeProject.id);
                                        navigate('/inbox');
                                    }
                                }}
                                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            />
                        )}
                    </div>
                </div>
            </header>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(name, color) => {
                    if (editingProject) {
                        updateProject(editingProject.id, { name, color });
                    }
                }}
                initialProject={editingProject}
            />

            <div className="mb-8">
                {isAdding ? (
                    <TaskForm
                        onSave={handleSaveTask}
                        onCancel={() => setIsAdding(false)}
                    />
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group w-full px-4 py-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10"
                    >
                        <Plus className="w-4 h-4 text-primary transition-transform group-hover:scale-125 duration-300" />
                        <span className="font-medium">Add task</span>
                    </button>
                )}
            </div>

            <div className="space-y-10">
                {/* Unsectioned Tasks */}
                {unsectionedTasks.length > 0 && (
                    <div className="space-y-1">
                        <TaskListSortable projectId={activeProject.id} sectionId={null} tasks={unsectionedTasks} isNested={false} />
                    </div>
                )}

                {/* Sections */}
                {projectSections.map((section: Section) => (
                    <SectionList
                        key={section.id}
                        section={section}
                        tasks={tasksBySection[section.id] || []}
                    />
                ))}

                {/* Add Section */}
                {isAddingSection ? (
                    <form onSubmit={handleCreateSection} className="p-4 rounded-xl border border-border/50 bg-background/50">
                        <input
                            data-testid="section-name-input"
                            type="text"
                            placeholder="Name this section"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium mb-3"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button type="submit" size="sm" disabled={!newSectionName.trim()}>Add section</Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingSection(false)}>Cancel</Button>
                        </div>
                    </form>
                ) : (
                    <div className="pt-2 border-t border-border/20">
                        <button
                            onClick={() => setIsAddingSection(true)}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-1"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add section</span>
                        </button>
                    </div>
                )}

                {/* Empty Project State */}
                {projectTasks.length === 0 && projectSections.length === 0 && !isTasksLoading && !isAdding && !isAddingSection && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                        <div className="p-4 rounded-full bg-muted/50">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="font-bold">This project is empty</p>
                            <p className="text-sm">Get started by adding your first task.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>Add Task</Button>
                    </div>
                )}
            </div>

        </div>
    );
};
