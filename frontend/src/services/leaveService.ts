import api from "./api";

export const getLeaveRequests = async () => {
  const response = await api.get("/leave");
  return response.data;
};

export const applyLeave = async (
  leaveData: any
) => {
  const response = await api.post(
    "/leave/apply",
    leaveData
  );

  return response.data;
};

export const approveLeave = async (
  id: number
) => {
  const response = await api.put(
    `/leave/approve/${id}`
  );

  return response.data;
};

export const rejectLeave = async (
  id: number
) => {
  const response = await api.put(
    `/leave/reject/${id}`
  );

  return response.data;
};