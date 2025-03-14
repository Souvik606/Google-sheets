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
    } else {
      console.error("Unexpected Error:", error);
    }
  }
};
