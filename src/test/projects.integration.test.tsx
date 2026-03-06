import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderApp, resetState, safeClick } from './helpers/ui';

describe('Projects Integration', () => {
    beforeEach(() => {
        resetState();
    });

    it('creates a project, navigates to it, and creates a section', async () => {
        const { user } = await renderApp();

        // 1. Open Add Project modal from Sidebar
        const addProjectBtn = await screen.findByTestId('add-project-btn');
        await safeClick(user, addProjectBtn);

        // 2. Fill in project details
        const nameInput = await screen.findByTestId('project-name-input');
        await user.type(nameInput, 'My Integration Project');

        const submitBtn = screen.getByRole('button', { name: 'Add Project' });
        await safeClick(user, submitBtn);

        // 3. Project should appear in the Sidebar
        const projectLink = await screen.findByText('My Integration Project');
        expect(projectLink).toBeInTheDocument();

        // 4. Navigate to the new project
        await safeClick(user, projectLink);

        // Wait for project page to load (header should have project name)
        await waitFor(async () => {
            const headings = await screen.findAllByRole('heading', { name: 'My Integration Project' });
            expect(headings.length).toBeGreaterThan(0);
        });

        // 5. Add a section
        // There might be multiple 'Add section' if empty state has one, but usually it's a toggle button
        const addSectionToggle = screen.getByRole('button', { name: /Add section/i });
        await safeClick(user, addSectionToggle);

        const sectionInput = await screen.findByTestId('section-name-input');
        await user.type(sectionInput, 'Phase 1');

        const saveSectionBtn = screen.getByTestId('section-save-btn');
        await safeClick(user, saveSectionBtn);

        // 6. Verify section appears
        await waitFor(async () => {
            const sectionHeader = await screen.findByText('Phase 1');
            expect(sectionHeader).toBeInTheDocument();
        });
    });
});
