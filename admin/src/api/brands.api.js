import api from "./axios";

export const getBrandsApi = (params) =>
    api.get("/brands", { params });

export const createBrandApi = (data) =>
    api.post("/brands", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const updateBrandApi = (id, data) =>
    api.put(`/brands/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const toggleBrandStatusApi = (id, status) =>
    api.patch(`/brands/${id}/status`, { status });

export const deleteBrandApi = (id) =>
    api.delete(`/brands/${id}`);
