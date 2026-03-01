import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Layout } from '../../components/layout';

// Lazy load feature pages
const InboxPage = lazy(() => import('../../features/inbox').then(mod => ({ default: mod.Inbox })));
const TodayPage = lazy(() => import('../../features/today').then(mod => ({ default: mod.Today })));
const UpcomingPage = lazy(() => import('../../features/upcoming').then(mod => ({ default: mod.Upcoming })));
const ProjectsPage = lazy(() => import('../../features/projects').then(mod => ({ default: mod.Projects })));
const LabelsPage = lazy(() => import('../../features/labels').then(mod => ({ default: mod.Labels })));
const FiltersPage = lazy(() => import('../../features/filters').then(mod => ({ default: mod.Filters })));

const SuspenseFallback = () => (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading...
    </div>
);

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Suspense fallback={<SuspenseFallback />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/inbox" replace />} />
                        <Route path="/inbox" element={<InboxPage />} />
                        <Route path="/today" element={<TodayPage />} />
                        <Route path="/upcoming" element={<UpcomingPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/labels" element={<LabelsPage />} />
                        <Route path="/filters" element={<FiltersPage />} />
                    </Routes>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
};

export default AppRouter;
