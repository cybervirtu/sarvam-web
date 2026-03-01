import { Menu, Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useThemeStore } from '../../app/store/theme';
import { IconButton } from '../common/IconButton';
import { useLocation } from 'react-router-dom';

export const Header = () => {
    const toggleSidebar = useAppStore((state) => state.toggleSidebar);
    const { theme, setTheme } = useThemeStore();
    const location = useLocation();

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    // Get page title from path
    const getPageTitle = (pathname: string) => {
        const path = pathname.split('/').pop() || 'Today';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <IconButton
                    icon={Menu}
                    onClick={toggleSidebar}
                    className="md:hidden"
                    aria-label="Toggle Sidebar"
                />

                <h1 className="text-lg font-bold text-foreground tracking-tight hidden sm:block">
                    {getPageTitle(location.pathname)}
                </h1>

                <div className="hidden md:flex items-center bg-muted/40 rounded-xl px-3 h-10 w-80 border border-transparent focus-within:border-primary/20 focus-within:bg-background focus-within:shadow-soft transition-all duration-200">
                    <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects..."
                        className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1">
                <IconButton
                    icon={theme === 'dark' ? Moon : Sun}
                    onClick={toggleTheme}
                    title={`Theme: ${theme}`}
                />

                <div className="relative">
                    <IconButton icon={Bell} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse pointer-events-none"></span>
                </div>

                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shrink-0 ml-1 flex items-center justify-center text-primary-foreground shadow-premium ring-2 ring-background cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </header>
    );
};
