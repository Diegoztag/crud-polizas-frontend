import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import PolizasList from "../pages/polizas/PolizasList";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <PolizasList />,
            },
        ],
    },
]);
