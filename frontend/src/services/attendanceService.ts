import api from "./api";

export const getAttendance = async () => {
  const response = await api.get("/attendance");
  return response.data;
};

export const checkIn = async (
  employee_id: number
) => {
  const response = await api.post(
    "/attendance/check-in",
    { employee_id }
  );

  return response.data;
};

export const checkOut = async (
  employee_id: number
) => {
  const response = await api.post(
    "/attendance/check-out",
    { employee_id }
  );

  return response.data;
};

export const getMonthlyAttendance =
  async (
    month: number,
    year: number
  ) => {

    const response =
      await api.get(
        `/attendance/monthly?month=${month}&year=${year}`
      );

    return response.data;
  };

  export const getAttendanceDashboard =
  async () => {

    const response =
      await api.get(
        "/attendance/dashboard"
      );

    return response.data;
  };

  export const updateAttendance =
  async (
    id: number,
    data: {
  status: string;
  remarks: string;
  overtime_hours: number;
  fine_minutes: number;
}
  ) => {

    const response =
      await api.put(
        `/attendance/${id}`,
        data
      );

    return response.data;
  };

  export const bulkMarkAttendance =
  async (
    attendance_date: string,
    records: any[]
  ) => {

    const response =
      await api.post(
        "/attendance/bulk",
        {
          attendance_date,
          records
        }
      );

    return response.data;
  };

  export const deleteAttendance =
  async (id: number) => {

    const response =
      await api.delete(
        `/attendance/${id}`
      );

    return response.data;
  };