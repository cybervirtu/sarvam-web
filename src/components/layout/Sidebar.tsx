import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Inbox, Calendar, CalendarDays,
    CheckCircle2, FolderKanban, Tags, Filter, X,
    Plus, Settings, Hash
} from 'lucide-react';
import { useUIStore, useProjectStore } from '../../app/store';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const { projects, fetchProjectsAndLabels } = useProjectStore();

    useEffect(() => {
        if (projects.length === 0) {
            fetchProjectsAndLabels();
        }
    }, [projects.length, fetchProjectsAndLabels]);

    const mainNav = [
        { icon: Inbox, label: 'Inbox', path: '/inbox', count: 5 },
        { icon: Calendar, label: 'Today', path: '/today', count: 2 },
        { icon: CalendarDays, label: 'Upcoming', path: '/upcoming' },
    ];

    const renderNavItems = (items: { icon: React.ElementType; label: string; path: string; count?: number; color?: string }[]) => (
        <ul className="space-y-1">
            {items.map((item) => (
                <li key={item.path}>
                    <NavLink
                        to={item.path}
                        onClick={() => {
                            if (window.innerWidth < 768) {
                                toggleSidebar();
                            }
                        }}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 text-sm font-medium group relative select-none',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )
                        }
                    >
                        {item.color ? (
                            <div
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                        ) : (
                            <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", "group-hover:text-foreground")} />
                        )}
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.count !== undefined && (
                            <span className="text-[10px] font-semibold bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground group-hover:bg-muted-foreground/10">
                                {item.count}
                            </span>
                        )}
                        {/* Indicative active bar */}
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => cn(
                                "absolute left-0 w-1 h-5 bg-primary rounded-r-full transition-all duration-300",
                                isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                            )}
                        />
                    </NavLink>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-muted/20 flex flex-col pt-6 pb-6 px-4 shrink-0 border-r border-border transition-all duration-300 ease-in-out",
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    !isSidebarOpen && 'md:w-0 md:px-0 md:opacity-0 pointer-events-none md:border-none'
                )}
            >
                <div className="flex items-center justify-between px-2 mb-8">
                    <div className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground select-none">Sarvam</span>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-1 animate-fade-in group/sidebar">
                    <section>
                        <div className="px-3 mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.1em] select-none">
                                Navigation
                            </span>
                        </div>
                        {renderNavItems(mainNav)}
                    </section>

                    <section>
                        <div className="px-3 mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.1em] select-none">
                                Workspace
                            </span>
                            <button className="p-1 text-muted-foreground/40 hover:text-foreground hover:bg-muted rounded transition-colors opacity-0 group-hover/sidebar:opacity-100">
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Static Workspace Links */}
                        {renderNavItems([
                            { icon: FolderKanban, label: 'Projects', path: '/projects' },
                            { icon: Tags, label: 'Labels', path: '/labels' },
                            { icon: Filter, label: 'Filters', path: '/filters' },
                        ])}

                        {/* Dynamic Projects */}
                        {projects.length > 0 && (
                            <div className="mt-4 space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] font-semibold text-muted-foreground/30 uppercase tracking-wider">My Projects</span>
                                </div>
                                {renderNavItems(projects.filter(p => !p.isInbox).map(p => ({
                                    icon: Hash,
                                    label: p.name,
                                    path: `/projects/${p.id}`,
                                    color: p.color
                                })))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="mt-auto pt-6 border-t border-border/50">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

