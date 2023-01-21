import axios from "axios";

const api = axios.create({
  baseURL: "https://api.unsplash.com/",
  params: {
    client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  },
});

export default api;
