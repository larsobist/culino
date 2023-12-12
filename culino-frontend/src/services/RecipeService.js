import http from "../http-common";
import authHeader from "./AuthHeader";

// Get all recipes
const getAll = () => {
  return http.get("/recipes", { headers: authHeader() });
};

// Get a recipe by ID
const get = (id) => {
  return http.get(`/recipes/${id}`, { headers: authHeader() });
};

// Create a new recipe
const create = (data) => {
  return http.post("/recipes", data, { headers: authHeader() });
};

// Update a recipe by ID
const update = (id, data) => {
  return http.put(`/recipes/${id}`, data, { headers: authHeader() });
};

// Delete a recipe by ID
const remove = (id) => {
  return http.delete(`/recipes/${id}`, { headers: authHeader() });
};

// Delete all recipes
const removeAll = () => {
  return http.delete(`/recipes`, { headers: authHeader() });
};

// Find recipes by title
const findByTitle = (title) => {
  return http.get(`/recipes?title=${title}`, { headers: authHeader() });
};

// Export the RecipeService object with all the defined functions
const RecipeService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default RecipeService;
