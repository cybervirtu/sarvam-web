import React from 'react';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};
