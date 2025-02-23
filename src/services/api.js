import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const polizasApi = {
    getAll: () => api.get("/polizas"),
    getById: (id) => api.get(`/polizas/${id}`),
    create: (data) => api.post("/polizas", data),
    update: (id, data) => api.put(`/polizas/${id}`, data),
    delete: (id) => api.delete(`/polizas/${id}`),
    updateEmpleado: (id, idEmpleado) => 
        axios.put(`/api/polizas/${id}/empleado?idEmpleado=${idEmpleado}`),
};

export const empleadosApi = {
    getAll: () => api.get("/empleados"),
    getById: (id) => api.get(`/empleados/${id}`),
};

export const inventarioApi = {
    getAll: () => api.get("/inventario"),
    getBySku: (sku) => api.get(`/inventario/${sku}`),
};

export default api;
