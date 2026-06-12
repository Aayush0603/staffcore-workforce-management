import api from "./api";

export const createBankDetails =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.post(
        `/employees/${employeeId}/bank-details`,
        data
      );

    return response.data;
};

export const getBankDetails =
  async (
    employeeId: number
  ) => {

    const response =
      await api.get(
        `/employees/${employeeId}/bank-details`
      );

    return response.data;
};

export const updateBankDetails =
  async (
    employeeId: number,
    data: any
  ) => {

    const response =
      await api.put(
        `/employees/${employeeId}/bank-details`,
        data
      );

    return response.data;
};