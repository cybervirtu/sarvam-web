import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderApp, resetState, safeClick, openTaskDrawer, waitForDrawer } from './helpers/ui';

describe('Subtask Integration', () => {
    beforeEach(() => {
        resetState();
    });

    it('creates a subtask and verifies it in the drawer and main list', async () => {
        const { user } = await renderApp();

        // 1. Create a parent task
        const addTaskBtn = await screen.findByText('Add task');
        await safeClick(user, addTaskBtn);

        const titleInput = await screen.findByTestId('task-title-input');
        await user.type(titleInput, 'Parent Task');
        await safeClick(user, screen.getByTestId('task-save-btn'));

        // 2. Open drawer
        await openTaskDrawer(user, 'Parent Task');
        await waitForDrawer();

        // 3. Add a subtask
        const subtaskInput = await screen.findByTestId('add-subtask-input');
        await user.type(subtaskInput, 'Child Subtask 1');
        const addBtn = await screen.findByTestId('add-subtask-btn');
        await safeClick(user, addBtn);

        // 4. Verify subtask appears in drawer
        await screen.findByText('Child Subtask 1');

        // 5. Close drawer
        const closeBtn = screen.getByTitle('Close');
        await safeClick(user, closeBtn);

        // 6. Verify subtask appears in main list (should be indented)
        await waitFor(async () => {
            const subtaskEl = await screen.findByText('Child Subtask 1');
            expect(subtaskEl).toBeInTheDocument();

            // It should be within a TaskItem that has text-xs relative to its title
            const titleEl = subtaskEl.closest('h4');
            expect(titleEl).toHaveClass('text-xs');
        });
    });

    it('cascades project updates to subtasks', async () => {
        const { user } = await renderApp();

        // Create project
        const addProjectBtn = await screen.findByTestId('add-project-btn');
        await safeClick(user, addProjectBtn);
        await user.type(await screen.findByTestId('project-name-input'), 'Target Project');
        await safeClick(user, screen.getByRole('button', { name: 'Add Project' }));

        // Create parent task in Inbox
        const inboxLink = screen.getByRole('link', { name: /Inbox/i });
        await safeClick(user, inboxLink);
        await safeClick(user, await screen.findByText('Add task'));
        await user.type(await screen.findByTestId('task-title-input'), 'Cascade Parent');
        await safeClick(user, screen.getByTestId('task-save-btn'));

        // Add subtask
        await openTaskDrawer(user, 'Cascade Parent');
        const subtaskInput = await screen.findByTestId('add-subtask-input');
        await user.type(subtaskInput, 'Cascade Child');
        await safeClick(user, screen.getByTestId('add-subtask-btn'));

        // Change project in drawer
        const projectSelect = await screen.findByTestId('task-project-select');
        const targetProjectOption = Array.from(projectSelect.querySelectorAll('option')).find(opt => opt.text === 'Target Project');
        await user.selectOptions(projectSelect, targetProjectOption!.value);
        await safeClick(user, screen.getByTitle('Close'));

        // Verify it disappeared from Inbox (current view)
        await waitFor(() => {
            expect(screen.queryByText('Cascade Parent')).not.toBeInTheDocument();
        });

        // Go to new project and verify both are there
        const projectLink = await screen.findByRole('link', { name: /Target Project/i });
        await safeClick(user, projectLink);

        // Use findByText which has built-in retry
        await screen.findByText('Cascade Parent');
        await screen.findByText('Cascade Child');
    });
});
