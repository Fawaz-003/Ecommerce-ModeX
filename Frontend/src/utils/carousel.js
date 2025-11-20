import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/carousel`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("user-token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchSlides = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

export const uploadSlide = async (slideData) => {
  const formData = new FormData();
  formData.append("image", slideData.imageFile);
  formData.append("title", slideData.title);
  formData.append("description", slideData.description);
  formData.append("link", slideData.link);
  formData.append("order", slideData.order);

  const response = await axios.post(`${API_URL}/add`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateSlide = async (id, slideData) => {
  const formData = new FormData();
  // Only append image if a new one was selected
  if (slideData.imageFile) {
    formData.append("image", slideData.imageFile);
  }
  formData.append("title", slideData.title);
  formData.append("description", slideData.description);
  formData.append("link", slideData.link);
  if (slideData.order !== undefined) {
    formData.append("order", slideData.order);
  }

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteSlide = async (id) => {
  const response = await axios.delete(`${API_URL}/remove/${id}`, getAuthHeaders());
  return response.data;
};