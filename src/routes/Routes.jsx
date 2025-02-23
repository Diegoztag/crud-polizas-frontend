import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import PolizasList from "../pages/polizas/PolizasList";
import PolizaForm from "../pages/polizas/PolizaForm";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <PolizasList />,
            },
            {
                path: "polizas",
                element: <PolizasList />,
            },
            {
                path: "poliza/nueva",
                element: <PolizaForm />,
            },
        ],
    },
]);
