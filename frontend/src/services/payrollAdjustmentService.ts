import api from "./api";

export const getPayrollAdjustments =
  async () => {
    const response =
      await api.get(
        "/payroll-adjustments"
      );

    return response.data;
};

export const createPayrollAdjustment =
  async (data: any) => {
    const response =
      await api.post(
        "/payroll-adjustments",
        data
      );

    return response.data;
};

export const updatePayrollAdjustment =
  async (
    id: number,
    data: any
  ) => {
    const response =
      await api.put(
        `/payroll-adjustments/${id}`,
        data
      );

    return response.data;
};

export const recalculatePayroll =
  async (
    employee_id: number,
    month: number,
    year: number
  ) => {

    const response =
      await api.post(
        "/payroll/recalculate",
        {
          employee_id,
          month,
          year,
        }
      );

    return response.data;
};

export const getAdjustmentByEmployee =
  async (
    employeeId: number,
    month: number,
    year: number
  ) => {

    const response =
      await api.get(
        "/payroll-adjustments/employee",
        {
          params: {
            employeeId,
            month,
            year,
          },
        }
      );

    return response.data;
};