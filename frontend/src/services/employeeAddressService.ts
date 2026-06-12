import api from "./api";

export const createAddress =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.post(
        `/employees/${employeeId}/address`,
        data
      );

    return response.data;
};

export const getAddress =
  async (
    employeeId: number
  ) => {

    const response =
      await api.get(
        `/employees/${employeeId}/address`
      );

    return response.data;
};

export const updateAddress =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.put(
        `/employees/${employeeId}/address`,
        data
      );

    return response.data;
};