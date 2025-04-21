// import axios from "axios";
// import { parseCookies, destroyCookie } from "nookies";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// api.interceptors.request.use((config) => {
//   const cookies = parseCookies();
//   const token = cookies.token;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       destroyCookie(null, "token");
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
