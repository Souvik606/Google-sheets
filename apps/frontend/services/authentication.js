import api from "@/lib/api";

export const loginService = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const signupService = async ({ profileIcon, name, email, password }) => {
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
};
