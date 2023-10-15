import AuthGuard from 'app/auth/AuthGuard'
import NotFound from 'app/views/sessions/NotFound'
import dashboardRoutes from 'app/views/Dashboard/DashboardRoutes'
import moduleManagementRoutes from 'app/views/ModuleManagement/ModuleManagementRoutes';
import sessionRoutes from 'app/views/sessions/SessionRoutes'
import V5GlobalLayout from '../components/V5GlobalLayout/V5GlobalLayout'
import { Navigate } from 'react-router-dom'
import workflowScreenRoutes from 'app/views/WorkflowScreen/WorkflowScreenRoutes';
import userProfileRoutes from 'app/views/UserProfile/UserProfileRoutes';
import reportsRoutes from 'app/views/Reports/ReportsRoutes';


export const AllPages = () => {
    const all_routes = [
        {
            element: (
                <AuthGuard>
                    <V5GlobalLayout />
                </AuthGuard>
            ),
            children: [...dashboardRoutes, ...moduleManagementRoutes, ...workflowScreenRoutes, ...userProfileRoutes, ...reportsRoutes],
        },
        ...sessionRoutes,
        {
            path: '/',
            element: <Navigate to="dashboard" />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ]

    return all_routes
}
