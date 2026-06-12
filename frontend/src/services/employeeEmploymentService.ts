import api from "./api";

export const createEmploymentDetails =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.post(
        `/employees/${employeeId}/employment-details`,
        data
      );

    return response.data;
};

export const getEmploymentDetails =
  async (
    employeeId: number
  ) => {

    const response =
      await api.get(
        `/employees/${employeeId}/employment-details`
      );

    return response.data;
};

export const updateEmploymentDetails =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.put(
        `/employees/${employeeId}/employment-details`,
        data
      );

    return response.data;
};