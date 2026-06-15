import api from "./api";

export const getOrganization =
  async () => {

    const response =
      await api.get(
        "/organization"
      );

    return response.data;
  };

export const updateOrganization =
  async (
    data: any
  ) => {

    const response =
      await api.put(
        "/organization",
        data
      );

    return response.data;
  };