import api from "./api";

export const getSalaryStructures =
  async () => {

    const response =
      await api.get(
        "/salary-structures"
      );

    return response.data;
};

export const createSalaryStructure =
  async (data: any) => {

    const response =
      await api.post(
        "/salary-structures",
        data
      );

    return response.data;
};

export const getSalaryHistory =
  async (
    employeeId: number
  ) => {

    const response =
      await api.get(
        `/salary-structures/history/${employeeId}`
      );

    return response.data;
};