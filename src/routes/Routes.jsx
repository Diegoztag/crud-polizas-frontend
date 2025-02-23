import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/MainLayout";
import PolizasList from "../pages/polizas/PolizasList";
import PolizaForm from "../pages/polizas/PolizaForm";
import PolizaEditForm from "../pages/polizas/PolizaEditForm";

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
                path: "poliza/crear",
                element: <PolizaForm />,
            },
            {
                path: "poliza/editar/:id",
                element: <PolizaEditForm />,
            },
        ],
    },
]);
