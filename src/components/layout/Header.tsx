import { Menu, Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useThemeStore } from '../../app/store/theme';

export const Header = () => {
    const toggleSidebar = useAppStore((state) => state.toggleSidebar);
    const { theme, setTheme } = useThemeStore();

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <header className="h-14 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors md:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden sm:flex items-center bg-muted rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all">
                    <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                    title={`Current theme: ${theme}`}
                >
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shrink-0 ml-2 flex items-center justify-center text-primary-foreground shadow-sm ring-2 ring-background cursor-pointer">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </header>
    );
};
