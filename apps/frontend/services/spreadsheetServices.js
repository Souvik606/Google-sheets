import api from "@/lib/api";

export const createSheetService = async ({ name, description }) => {
  const response = await api.post("/spreadsheet/create");

  return response.data;
};

export const getAllSheetsService = async () => {
  const response = await api.get("/spreadsheet");

  return response.data;
};
