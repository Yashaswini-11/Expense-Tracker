import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-uutl.onrender.com/api",
});

export default API;