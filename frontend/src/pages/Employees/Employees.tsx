import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Chip,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from "@mui/material";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import {
  getEmployees,
  deleteEmployee,
} from "../../services/employeeService";

const Employees = () => {

  const navigate = useNavigate();

  const [employees, setEmployees] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const fetchEmployees = async () => {
    try {

      const data =
        await getEmployees();

      setEmployees(
        data.data
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees =
    employees.filter((employee) =>
      employee.full_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const handleDeleteEmployee =
    async (
      id: number
    ) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this employee?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await deleteEmployee(
          id
        );

        alert(
          "Employee deleted successfully"
        );

        fetchEmployees();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to delete employee"
        );
      }
    };

  return (
    <AdminLayout>

      <Box sx={{ mb: 4 }}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
      mb: 1,
    }}
  >
    Employee Management
  </Typography>

  <Typography
    variant="body1"
    color="text.secondary"
  >
    Manage and monitor all staff records in StaffCore.
  </Typography>
</Box>

      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "repeat(3, 1fr)",
    },
    gap: 3,
    mb: 4,
  }}
>
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      border: "1px solid #E5E7EB",
    }}
  >
    <Typography color="text.secondary">
      Total Employees
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        color: "#0F766E",
      }}
    >
      {employees.length}
    </Typography>
  </Paper>

  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      border: "1px solid #E5E7EB",
    }}
  >
    <Typography color="text.secondary">
      Active Employees
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        color: "#16A34A",
      }}
    >
      {
        employees.filter(
          (e) =>
            e.status ===
            "ACTIVE"
        ).length
      }
    </Typography>
  </Paper>

  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      border: "1px solid #E5E7EB",
    }}
  >
    <Typography color="text.secondary">
      Inactive Employees
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        color: "#DC2626",
      }}
    >
      {
        employees.filter(
          (e) =>
            e.status !==
            "ACTIVE"
        ).length
      }
    </Typography>
  </Paper>
</Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
       <TextField
          size="small"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          sx={{
            flex: 1,
            minWidth: 250,
          }}
        />

        <Button
  variant="contained"
  size="large"
  onClick={() =>
    navigate("/employees/add")
  }
>
  + Add Employee
</Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>

          <TableHead
  sx={{
    backgroundColor:
      "#F8FAFC",
  }}
>

            <TableRow>

              <TableCell>
                Employee Code
              </TableCell>

              <TableCell>
                Full Name
              </TableCell>

              <TableCell>
                Department
              </TableCell>

              <TableCell>
                Designation
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

             {filteredEmployees.map(
    (employee) => (
      <TableRow
        key={employee.id}
        sx={{
          "&:hover": {
            backgroundColor:
              "#F8FAFC",
          },
        }}
      >

                  <TableCell>
                    {
                      employee.employee_code
                    }
                  </TableCell>

                  <TableCell>
                    {
                      employee.full_name
                    }
                  </TableCell>

                  <TableCell>
                    {
                      employee.department_name
                    }
                  </TableCell>

                  <TableCell>
                    {
                      employee.designation
                    }
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={
                        employee.status
                      }
                      color={
                        employee.status ===
                        "ACTIVE"
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />

                  </TableCell>

                  <TableCell>

                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/employees/edit/${employee.id}`
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() =>
                        handleDeleteEmployee(
                          employee.id
                        )
                      }
                    >
                      Delete
                    </Button>

                  </TableCell>

                </TableRow>
              )
            )}

          </TableBody>

        </Table>

      </Paper>

    </AdminLayout>
  );
};

export default Employees;