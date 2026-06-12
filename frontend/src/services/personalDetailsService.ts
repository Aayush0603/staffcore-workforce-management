import api from "./api";

export const createPersonalDetails =
  async (data: any) => {

    const response =
      await api.post(
        `/employees/${data.employee_id}/personal-details`,
        data
      );

    return response.data;
};

export const getPersonalDetails =
  async (
    employeeId: number
  ) => {

    const response =
      await api.get(
        `/employees/${employeeId}/personal-details`
      );

    return response.data;
};

export const updatePersonalDetails =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.put(
        `/employees/${employeeId}/personal-details`,
        data
      );

    return response.data;
};