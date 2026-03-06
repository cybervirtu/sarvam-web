import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '@/App';
import { useTaskStore, useProjectStore, useUIStore } from '@/app/store';

// Custom render that wraps App with router and returns a configured userEvent instance
export const renderApp = async () => {
    const user = userEvent.setup();
    const output = render(<App />);

    // Wait for the mock data fetches to complete so they don't overwrite test interactions
    await waitFor(() => {
        expect(useTaskStore.getState().isLoading).toBe(false);
        expect(useProjectStore.getState().isLoading).toBe(false);
        expect(useTaskStore.getState().tasks.length).toBeGreaterThan(0);
        expect(useProjectStore.getState().projects.length).toBeGreaterThan(0);
    }, { timeout: 2000 });

    return { user, ...output };
};

// Resets localStorage and Zustand stores completely between tests
export const resetState = () => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [], isLoading: false, error: null });
    useProjectStore.setState({ projects: [], sections: [], labels: [], isLoading: false, error: null });
    useUIStore.setState({
        activeTaskId: null,
        isSidebarOpen: true,
    });
};

export const openTaskDrawer = async (user: ReturnType<typeof userEvent.setup>, taskTitle: string) => {
    // Find task title by text
    const titleEl = await screen.findByText(taskTitle);
    // Find the closest task-item container which has the onClick handler
    const taskItem = titleEl.closest('[data-testid^="task-item-"]');
    if (!taskItem) throw new Error(`Could not find task-item container for: ${taskTitle}`);

    // Using user.click for better reliability in tests
    await user.click(taskItem);
    await waitForDrawer();
};

export const waitForDrawer = async () => {
    // Wait until the drawer container itself is mounted
    const drawer = await screen.findByTestId('task-drawer');
    // Also wait until the title input within it is fully available
    await waitFor(() => {
        expect(screen.getByTestId('task-drawer-title')).toBeInTheDocument();
    });
    return drawer;
};

// Set date in the Happy DOM environment securely
export const setDate = async (user: ReturnType<typeof userEvent.setup>, inputEl: HTMLElement, dateStr: string) => {
    await user.clear(inputEl);
    // UserEvent type acts like a user typing. 
    await user.type(inputEl, dateStr);

    // In Happy DOM we might need to manually fire blur if the Popover or component relies on onBlur
    // But user.tab() or user.click(document.body) is better
    await user.click(document.body);
};

export const expectDueDisplay = (dateDisplay: string) => {
    // Looks for the placeholder/display inside the date picker
    expect(screen.getByDisplayValue(dateDisplay)).toBeInTheDocument();
};

// Safe click to ensure element is enabled
export const safeClick = async (user: ReturnType<typeof userEvent.setup>, element: HTMLElement) => {
    await waitFor(() => {
        expect(element).not.toBeDisabled();
    });
    await user.click(element);
};
