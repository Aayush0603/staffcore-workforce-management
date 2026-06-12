import api from "./api";

export const getPayrolls = async (
  month: number,
  year: number
) => {
  const response = await api.get(
    `/payroll?month=${month}&year=${year}`
  );

  return response.data;
};

export const generatePayroll = async (
  month: number,
  year: number
) => {
  const response = await api.post(
    "/payroll/generate",
    {
      month,
      year
    }
  );

  return response.data;
};

export const downloadPayrollExcel =
  async (
    month: number,
    year: number
  ) => {

    const response =
      await api.get(
        "/payroll/export/excel",
        {
          params: {
            month,
            year,
          },
          responseType: "blob",
        }
      );

    return response.data;
};

export const downloadPayrollPdf =
  async (
    month: number,
    year: number
  ) => {

    const response =
      await api.get(
        "/payroll/export/pdf",
        {
          params: {
            month,
            year,
          },
          responseType: "blob",
        }
      );

    return response.data;
};