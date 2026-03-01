import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../app/store';
import { TaskDrawer } from '../tasks/TaskDrawer';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20 relative">
            <Sidebar />
            <div className={cn(
                "flex-1 flex flex-col h-full overflow-hidden relative min-w-0 transition-all duration-300",
                isSidebarOpen ? "md:ml-0" : "md:ml-0" // Sidebar handles its own collapse width now
            )}>
                <Header />
                <main className="flex-1 overflow-y-auto w-full scroll-smooth">
                    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto w-full min-h-full flex flex-col animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
            <TaskDrawer />
        </div>
    );
};
