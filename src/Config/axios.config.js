import axios from "axios";

const server = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    }
});

server.interceptors.request.use(
    config => {
    //   const token = localStorage.getItem('authToken');
      const token = "TOKEN";
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

  export { server };
