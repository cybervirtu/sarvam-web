import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen w-full bg-white text-slate-900 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
