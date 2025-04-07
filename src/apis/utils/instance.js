import axios from "axios";

const instance = axios.create({
  baseURL: "http://116.125.141.139:8091/",
  headers: { "X-Custom-header": "foobar" },
  timeout: 1000,
});

export default instance;
