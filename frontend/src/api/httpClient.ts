import axios, { CreateAxiosDefaults } from "axios";
import { toast } from "react-toastify";

export const interceptors: CreateAxiosDefaults = {
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  responseType: "json",
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,  
};

export const httpClient = axios.create({
  ...interceptors,
});

httpClient.interceptors.response.use(
  // async (response) => {
  //   console.error("cp-server - interceptors - response", response);
  //   // return Promise.resolve(response);
  //   return response;
  // },
  async (response) => {
    console.log(response);
    
    try {
      // console.error("cp-server - interceptors - response", response);

      // Cek apakah response memiliki data JSON
      if (typeof response.data === "object") {
        return Promise.resolve(response);
      } else {
        throw new Error("Invalid JSON response");
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async (error) => {
    // console.error("cp-server - interceptors - error", error);
    toast(`Something wrong! ${error}`, { type: "error" });
    return Promise.reject(error);
  }
);
