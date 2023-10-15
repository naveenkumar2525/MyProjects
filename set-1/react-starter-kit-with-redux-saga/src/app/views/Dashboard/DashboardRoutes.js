import React, { lazy } from 'react'
import Chart from './components/Chart';
import SubModuleCards from './components/SubModuleCards';
import Dashboard from './Dashboard';

const dashboardRoutes = [
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/module/:name/:id',
        element: <SubModuleCards />
    }, {
        path: '/module/:name',
        element: <SubModuleCards />
    },
    {
        path: '/Charts/:id',
        element: <Chart />
    }
]

export default dashboardRoutes
