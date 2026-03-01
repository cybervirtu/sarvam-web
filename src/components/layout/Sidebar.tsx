import { NavLink } from 'react-router-dom';
import {
    Inbox, Calendar, CalendarDays,
    CheckCircle2, FolderKanban, Tags, Filter, X
} from 'lucide-react';
import { useAppStore } from '../../app/store';

export const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useAppStore();

    const mainNav = [
        { icon: Inbox, label: 'Inbox', path: '/inbox' },
        { icon: Calendar, label: 'Today', path: '/today' },
        { icon: CalendarDays, label: 'Upcoming', path: '/upcoming' },
    ];

    const secondaryNav = [
        { icon: FolderKanban, label: 'Projects', path: '/projects' },
        { icon: Tags, label: 'Labels', path: '/labels' },
        { icon: Filter, label: 'Filters', path: '/filters' },
    ];

    const renderNavItems = (items: typeof mainNav) => (
        <div className="space-y-0.5">
            {items.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                        // Close sidebar on mobile after clicking
                        if (window.innerWidth < 768) {
                            toggleSidebar();
                        }
                    }}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                    }
                >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                </NavLink>
            ))}
        </div>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-muted/30 flex flex-col pt-4 pb-6 px-3 shrink-0 border-r border-border transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    } ${isSidebarOpen ? '' : 'md:hidden' /* If you want to allow collapsing on desktop too, handle it here */}`}
            >
                <div className="flex items-center justify-between px-3 mb-6">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">Sarvam Web</span>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                    {renderNavItems(mainNav)}

                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Workspace
                        </div>
                        {renderNavItems(secondaryNav)}
                    </div>
                </nav>
            </aside>
        </>
    );
};
