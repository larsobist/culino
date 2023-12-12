import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

// Register a new user
const register = (username, email, password, roles) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    roles,
  });
};

// Login with username and password
const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

// Logout the current user
const logout = () => {
  localStorage.removeItem("user");
};

// Get the current logged-in user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Export the AuthService object with all the defined functions
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
