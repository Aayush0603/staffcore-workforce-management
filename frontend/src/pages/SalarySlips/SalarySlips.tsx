import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import {
  getSalarySlips,
  downloadSalarySlip,
} from "../../services/salarySlipService";

interface SalarySlip {
  id: number;
  employee_code: string;
  full_name: string;
  designation: string;
  payroll_month: number;
  payroll_year: number;
  net_salary: number;
}

const SalarySlips = () => {
  const [salarySlips, setSalarySlips] =
    useState<SalarySlip[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
  useState("");

  const [month, setMonth] =
  useState<number | "">("");

  const [year, setYear] =
  useState<number | "">("");

  useEffect(() => {
    fetchSalarySlips();
  }, []);

  const fetchSalarySlips = async () => {
    try {
      const response =
        await getSalarySlips();

      setSalarySlips(
        response.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalarySlips =
  salarySlips.filter((slip) => {

    const matchesSearch =
      slip.full_name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||
      slip.employee_code
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesMonth =
      month === "" ||
      slip.payroll_month === month;

    const matchesYear =
      year === "" ||
      slip.payroll_year === year;

    return (
      matchesSearch &&
      matchesMonth &&
      matchesYear
    );
  });

  return (
    <AdminLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Salary Slips
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          View and download generated salary slips
        </Typography>

        <Paper
  sx={{
    p: 3,
    mb: 3,
  }}
>
  <Box
    sx={{
      display: "flex",
      gap: 2,
      flexWrap: "wrap",
    }}
  >
    <TextField
      label="Search Employee"
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(
          e.target.value
        )
      }
      sx={{ width: 250 }}
    />

    <TextField
      select
      label="Month"
      value={month}
      onChange={(e) =>
        setMonth(
          e.target.value === ""
            ? ""
            : Number(
                e.target.value
              )
        )
      }
      sx={{ width: 220 }}
    >
      <MenuItem value="">
        All Months
      </MenuItem>

      <MenuItem value={1}>January</MenuItem>
      <MenuItem value={2}>February</MenuItem>
      <MenuItem value={3}>March</MenuItem>
      <MenuItem value={4}>April</MenuItem>
      <MenuItem value={5}>May</MenuItem>
      <MenuItem value={6}>June</MenuItem>
      <MenuItem value={7}>July</MenuItem>
      <MenuItem value={8}>August</MenuItem>
      <MenuItem value={9}>September</MenuItem>
      <MenuItem value={10}>October</MenuItem>
      <MenuItem value={11}>November</MenuItem>
      <MenuItem value={12}>December</MenuItem>
    </TextField>

    <TextField
      label="Year"
      type="number"
      value={year}
      onChange={(e) =>
        setYear(
          e.target.value === ""
            ? ""
            : Number(
                e.target.value
              )
        )
      }
      sx={{ width: 150 }}
    />
  </Box>
</Paper>

        <Paper sx={{ p: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Employee Code
                  </TableCell>

                  <TableCell>
                    Employee Name
                  </TableCell>

                  <TableCell>
                   Designation
                  </TableCell>

                  <TableCell>
                    Month
                  </TableCell>

                  <TableCell>
                    Year
                  </TableCell>

                  <TableCell>
                    Net Salary
                  </TableCell>

                  <TableCell>
                    Download
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
  {filteredSalarySlips.length === 0 ? (
    <TableRow>
      <TableCell
        colSpan={7}
        align="center"
      >
        No salary slips found
      </TableCell>
    </TableRow>
  ) : (
    filteredSalarySlips.map((slip) => (
      <TableRow key={slip.id}>
        <TableCell>
          {slip.employee_code}
        </TableCell>

        <TableCell>
          {slip.full_name}
        </TableCell>

        <TableCell>
          {slip.designation}
        </TableCell>

        <TableCell>
          {
            [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ][slip.payroll_month]
          }
        </TableCell>

        <TableCell>
          {slip.payroll_year}
        </TableCell>

        <TableCell
          sx={{
            fontWeight: 700,
            color: "#16A34A",
          }}
        >
          Rs.{" "}
          {Number(
            slip.net_salary || 0
          ).toFixed(2)}
        </TableCell>

        <TableCell>
          <Button
            variant="contained"
            startIcon={
              <DownloadIcon />
            }
            onClick={() =>
              downloadSalarySlip(
                slip.id
              )
            }
          >
            Download
          </Button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default SalarySlips;