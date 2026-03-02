import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Inbox } from './index';
import { useTaskStore } from '../../app/store';
import { Task } from '../../types';

// Mock the components used within Inbox to isolate the test
vi.mock('../../components/tasks/TaskList', () => ({
    TaskList: ({ tasks, emptyMessage }: { tasks: unknown[]; emptyMessage: string }) => (
        <div data-testid="mock-task-list">
            {tasks.length === 0 ? emptyMessage : `Rendered ${tasks.length} tasks`}
        </div>
    )
}));

vi.mock('../../components/common/IconButton', () => ({
    IconButton: ({ title }: { title: string }) => <button data-testid={`mock-icon-button-${title}`}>{title}</button>
}));

describe('Inbox Feature', () => {
    beforeEach(() => {
        // Reset the store before each test
        useTaskStore.setState({
            tasks: [],
            isLoading: false,
            error: null
        });
    });

    it('should render the header and title correctly', () => {
        render(<Inbox />);

        expect(screen.getByText('Inbox')).toBeInTheDocument();
        expect(screen.getByText('All your tasks in one place.')).toBeInTheDocument();
    });

    it('should render view option buttons', () => {
        render(<Inbox />);

        expect(screen.getByTestId('mock-icon-button-View Options')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon-button-Board View')).toBeInTheDocument();
    });

    it('should display the empty message when there are no tasks', () => {
        render(<Inbox />);
        expect(screen.getByText('No tasks in your inbox. Relax!')).toBeInTheDocument();
    });

    it('should pass tasks to TaskList when there is data', () => {
        // Hydrate store with mock data
        useTaskStore.setState({
            tasks: [
                { id: '1', content: 'Task 1', isCompleted: false } as unknown as Task,
                { id: '2', content: 'Task 2', isCompleted: true } as unknown as Task
            ]
        });

        render(<Inbox />);
        expect(screen.getByText('Rendered 2 tasks')).toBeInTheDocument();
    });
});
