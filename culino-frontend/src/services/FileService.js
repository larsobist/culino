import http from "../http-common";
import authHeader from "./AuthHeader";

// Upload an image file
const uploadImg = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
    onUploadProgress,
  });
};

// Get all files
const getFiles = () => {
  return http.get("/files", { headers: authHeader() });
};

// Remove an image file by name
const removeImg = (name) => {
  return http.delete(`/files/${name}`, { headers: authHeader() });
};

// Export the FileService object with all the defined functions
const FileService = {
  uploadImg,
  getFiles,
  removeImg,
};

export default FileService;
