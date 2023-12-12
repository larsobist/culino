import axios from "axios";

export default axios.create({
  // Set the base URL for API requests
  baseURL: "http://localhost:8080/api",
  // Set the default headers for API requests
  headers: {
    "Content-type": "application/json"
  }
});
