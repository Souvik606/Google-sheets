import api from "@/lib/api";

export const loginService = async ({ email, password }) => {
  console.log(email, password);
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error("Unexpected Error:", error);
      throw error;
    }
  }
};

export const signupService = async ({ profileIcon, name, email, password }) => {
  console.log(profileIcon);
  try {
    const formData = new FormData();

    if (profileIcon) {
      formData.append("profileIcon", profileIcon);
    }

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    const response = await api.post("/auth/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error("Unexpected Error:", error);
      throw error;
    }
  }
};
