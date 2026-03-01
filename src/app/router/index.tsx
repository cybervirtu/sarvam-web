import { Routes, Route, Navigate } from 'react-router-dom';
import { Inbox as InboxPage } from '../../features/inbox';
import { Today as TodayPage } from '../../features/today';
import { Upcoming as UpcomingPage } from '../../features/upcoming';
import { Projects as ProjectsPage } from '../../features/projects';
import { Labels as LabelsPage } from '../../features/labels';
import { Filters as FiltersPage } from '../../features/filters';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/upcoming" element={<UpcomingPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/labels" element={<LabelsPage />} />
            <Route path="/filters" element={<FiltersPage />} />
        </Routes>
    );
};

export default AppRouter;
