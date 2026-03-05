import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp, resetState } from './helpers/ui';

describe('Smoke Test', () => {
    beforeEach(() => {
        resetState();
    });

    it('renders the app and displays the task list container', async () => {
        await renderApp();

        // At the root, it usually renders Inbox or Today, which has a TaskList
        const taskList = await screen.findByTestId('task-list');
        expect(taskList).toBeInTheDocument();

        // Quick add button should also be there
        const quickAddBtn = await screen.findByText('Add task');
        expect(quickAddBtn).toBeInTheDocument();
    });
});
