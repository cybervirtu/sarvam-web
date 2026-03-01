import { Menu, Bell, Search, User } from 'lucide-react';
import { useAppStore } from '../../app/store';

export const Header = () => {
    const toggleSidebar = useAppStore((state) => state.toggleSidebar);

    return (
        <header className="h-14 border-b border-slate-200 bg-white/50 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors md:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shrink-0 ml-2 flex items-center justify-center text-white shadow-sm ring-2 ring-white cursor-pointer">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </header>
    );
};
