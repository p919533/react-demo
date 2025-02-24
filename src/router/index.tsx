import { createBrowserRouter, Navigate } from "react-router-dom";
import { BasicLayout } from "@/layouts/basicLayout";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";


// import Message from '@/pages/message'


import { useRouteError } from 'react-router-dom';

export { routerAndTree } from "./router-tree";


const RouterErrorElement = () => {
  const error = useRouteError();
  throw error;
}



const router: any = createBrowserRouter([
    {
        path: '*',
        element: <BasicLayout />,
        children: [
            // {
            //     path: 'dashboard',
            //     element: <Dashboard />,
            // }
        ],
        errorElement: <RouterErrorElement />
    },
    {
        path: '/',
        element: (
            <Navigate to="/login" />
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    // {
    //     path: '/home',
    //     element: <Home />,
    // },
    // {
    //     path: '/dashboard',
    //     element: <Dashboard />,
    // },
]);



export default router