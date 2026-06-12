import api from "./api";

export const createWeeklyOff = async (
  employeeId: number,
  dayOfWeek: string
) => {
  const response = await api.post(
    `/employees/${employeeId}/weekly-off`,
    {
      day_of_week: dayOfWeek,
    }
  );

  return response.data;
};

export const getWeeklyOff = async (
  employeeId: number
) => {
  const response = await api.get(
    `/employees/${employeeId}/weekly-off`
  );

  return response.data;
};

export const updateWeeklyOff = async (
  employeeId: number,
  dayOfWeek: string
) => {
  const response = await api.put(
    `/employees/${employeeId}/weekly-off`,
    {
      day_of_week: dayOfWeek,
    }
  );

  return response.data;
};