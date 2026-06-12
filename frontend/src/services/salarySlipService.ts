import api from "./api";

export const getSalarySlips =
  async () => {

    const response =
      await api.get(
        "/salary-slip"
      );

    return response.data;
};

export const downloadSalarySlip =
  async (
    id: number
  ) => {

    const response =
      await api.get(
        `/salary-slip/download/${id}`,
        {
          responseType: "blob",
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      `salary-slip-${id}.pdf`
    );

    document.body.appendChild(
      link
    );

    link.click();

    window.URL.revokeObjectURL(
      url
    );

    link.remove();
};