import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Inbox } from './index';
import { useTaskStore, useProjectStore } from '../../app/store';
import { Task, Project } from '../../types';

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
        // Reset and hydrate stores before each test
        useProjectStore.setState({
            projects: [{ id: 'p1', name: 'Inbox', isInbox: true }] as unknown as Project[],
            isLoading: false,
            fetchProjectsAndLabels: vi.fn(),
        } as unknown as ReturnType<typeof useProjectStore.getState>);
        useTaskStore.setState({
            tasks: [
                { id: '1', title: 'Task 1', isCompleted: false, projectId: 'p1' } as unknown as Task,
                { id: '2', title: 'Task 2', isCompleted: true, projectId: 'p1' } as unknown as Task
            ],
            isLoading: false,
            error: null,
            fetchTasks: vi.fn(),
        } as unknown as ReturnType<typeof useTaskStore.getState>);
    });

    it('should render the header and title correctly', async () => {
        render(<Inbox />);

        expect(await screen.findByText('Inbox')).toBeInTheDocument();
        expect(screen.getByText('All your tasks in one place.')).toBeInTheDocument();
    });

    it('should render view option buttons', async () => {
        render(<Inbox />);

        expect(await screen.findByTestId('mock-icon-button-View Options')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon-button-Board View')).toBeInTheDocument();
    });

    it('should display the empty message when there are no tasks', async () => {
        useTaskStore.setState({ tasks: [] });

        render(<Inbox />);
        expect(await screen.findByText('No tasks in your inbox. Relax!')).toBeInTheDocument();
    });

    it('should pass tasks to TaskList when there is data', async () => {
        render(<Inbox />);
        expect(await screen.findByText('Rendered 2 tasks')).toBeInTheDocument();
    });
});
