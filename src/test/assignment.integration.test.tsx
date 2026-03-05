import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderApp, resetState, safeClick, openTaskDrawer } from './helpers/ui';

describe('Assignment Integration', () => {
    beforeEach(() => {
        resetState();
    });

    it('assigns a task to a project and section from the drawer', async () => {
        const { user } = await renderApp();

        // 1. Create a Project and Section via the UI directly
        const addProjectBtn = await screen.findByTestId('add-project-btn');
        await safeClick(user, addProjectBtn);

        const projectNameInput = await screen.findByTestId('project-name-input');
        await user.type(projectNameInput, 'Assign Target Project');

        const submitProjectBtn = screen.getByRole('button', { name: 'Add Project' });
        await safeClick(user, submitProjectBtn);

        const projectLink = await screen.findByText('Assign Target Project');
        await safeClick(user, projectLink);

        const addSectionToggle = await screen.findByRole('button', { name: /Add section/i });
        await safeClick(user, addSectionToggle);

        const sectionInput = await screen.findByTestId('section-name-input');
        await user.type(sectionInput, 'Target Section');

        const saveSectionBtn = screen.getByRole('button', { name: 'Add section' });
        await safeClick(user, saveSectionBtn);

        // 2. Go to Inbox and create a task
        const inboxLink = screen.getByText('Inbox');
        await safeClick(user, inboxLink);

        const addTaskBtn = await screen.findByText('Add task');
        await safeClick(user, addTaskBtn);

        const titleInput = await screen.findByTestId('task-title-input');
        await user.type(titleInput, 'Move Me');
        await safeClick(user, screen.getByTestId('task-save-btn'));

        // 3. Open Drawer
        await openTaskDrawer(user, 'Move Me');

        // 4. Find the selects
        const projectSelect = await screen.findByTestId('task-project-select');
        const sectionSelect = await screen.findByTestId('task-section-select');

        // Get the options
        const projectOptions = Array.from(projectSelect.getElementsByTagName('option'));
        const targetProjectOption = projectOptions.find(opt => opt.text === 'Assign Target Project');
        expect(targetProjectOption).toBeDefined();

        // 5. Change Project
        await user.selectOptions(projectSelect, targetProjectOption!.value);

        // Wait for section select to populate with "Target Section"
        await waitFor(() => {
            const sectionOptions = Array.from(sectionSelect.getElementsByTagName('option'));
            const targetSectionOption = sectionOptions.find(opt => opt.text === 'Target Section');
            expect(targetSectionOption).toBeDefined();
        });

        const targetSectionOption = Array.from(sectionSelect.getElementsByTagName('option')).find(opt => opt.text === 'Target Section');
        // 6. Change Section
        await user.selectOptions(sectionSelect, targetSectionOption!.value);

        // 7. Close drawer
        const closeBtn = screen.getByTitle('Close');
        await safeClick(user, closeBtn);

        // 8. Wait for drawer to close and verify it disappeared from Inbox!
        await waitFor(async () => {
            expect(screen.queryByTestId('task-drawer')).not.toBeInTheDocument();
            expect(screen.queryByText('Move Me')).not.toBeInTheDocument();
        });

        // 9. Go to the project page and verify it appears there!
        const projectSideLink = screen.getByRole('link', { name: 'Assign Target Project' });
        await safeClick(user, projectSideLink);

        await waitFor(async () => {
            expect(await screen.findByText('Move Me')).toBeInTheDocument();
        });
    });
});
