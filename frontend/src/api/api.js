import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

export const fetchSymptoms = () => API.get("/symptoms");
export const fetchDiseases = () => API.get("/diseases");
export const diagnose = (data) => API.post("/diagnose", data);

export default API;
