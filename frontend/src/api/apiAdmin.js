import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("admin_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginAdmin = (data) => API.post("/auth/login", data);

// Symptoms
export const getSymptoms = () => API.get("/admin/symptoms");
export const addSymptom = (data) => API.post("/admin/symptoms", data);
export const updateSymptom = (id, data) => API.put(`/admin/symptoms/${id}`, data);
export const deleteSymptom = (id) => API.delete(`/admin/symptoms/${id}`);

// Diseases
export const getDiseases = () => API.get("/admin/diseases");
export const addDisease = (data) => API.post("/admin/diseases", data);
export const updateDisease = (id, data) => API.put(`/admin/diseases/${id}`, data);
export const deleteDisease = (id) => API.delete(`/admin/diseases/${id}`);

// Rules
export const getRules = () => API.get("/admin/rules");
export const addRule = (data) => API.post("/admin/rules", data);
export const updateRule = (id, data) => API.put(`/admin/rules/${id}`, data);
export const deleteRule = (id) => API.delete(`/admin/rules/${id}`);

// Results
export const getResults = () => API.get("/admin/results");
export const deleteResult = (id) => API.delete(`/admin/results/${id}`);


export default API;
