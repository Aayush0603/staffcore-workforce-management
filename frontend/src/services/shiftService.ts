import api from "./api";

export const getShifts = async () => {
  const response = await api.get("/shifts");
  return response.data;
};

export const assignShift = async (
  shiftData: {
    employee_id: number;
    shift_id: number;
    effective_from: string;
  }
) => {
  const response = await api.post(
    "/shifts/assign",
    shiftData
  );

  return response.data;
};

export const getCurrentShift = async (
  employeeId: number
) => {
  const response = await api.get(
    `/shifts/current/${employeeId}`
  );

  return response.data;
};

export const getShiftHistory = async (
  employeeId: number
) => {
  const response = await api.get(
    `/shifts/history/${employeeId}`
  );

  return response.data;
};