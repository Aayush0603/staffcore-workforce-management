import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { getEmployees } from "../../services/employeeService";
import { bulkMarkAttendance } from "../../services/attendanceService";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

const statusOptions = [
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "PAID_LEAVE",
];

const AttendanceEntry = () => {
  const [attendanceDate, setAttendanceDate] =
    useState("");

  const [employees, setEmployees] =
    useState<any[]>([]);

  const loadEmployees = async () => {
    try {
      const response =
        await getEmployees();

      setEmployees(
        response.data.map(
          (emp: any) => ({
            employee_id: emp.id,
            employee_code:
              emp.employee_code,
            full_name:
              emp.full_name,
            designation:
              emp.designation,
            status:
              "PRESENT",
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleStatusChange = (
    employeeId: number,
    value: string
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employee_id === employeeId
          ? {
              ...emp,
              status: value,
            }
          : emp
      )
    );
  };

  const handleSaveAttendance =
    async () => {
      try {
        await bulkMarkAttendance(
          attendanceDate,
          employees.map((emp) => ({
            employee_id:
              emp.employee_id,
            status:
              emp.status,
          }))
        );

        alert(
          "Attendance saved successfully"
        );

      } catch (error) {
        console.error(error);
        alert(
          "Failed to save attendance"
        );
      }
    };

  return (
    <AdminLayout>
    <Box sx={{ p: 3 }}>

      <Typography
  variant="h4"
  sx={{
    mb: 3,
    fontWeight: 700,
  }}
>
  Attendance Correction
</Typography>

      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
        >
          Attendance Entry
        </Typography>

        <TextField
  label="Attendance Date"
  type="date"
  value={attendanceDate}
  onChange={(e) =>
    setAttendanceDate(
      e.target.value
    )
  }
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
  sx={{ mb: 3 }}
/>

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
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map(
              (employee) => (
                <TableRow
                  key={
                    employee.employee_id
                  }
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
                      employee.designation
                    }
                  </TableCell>

                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={
                        employee.status
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          employee.employee_id,
                          e.target.value
                        )
                      }
                    >
                      {statusOptions.map(
                        (
                          status
                        ) => (
                          <MenuItem
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {
                              status
                            }
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={
            handleSaveAttendance
          }
        >
          Save Attendance
        </Button>
      </Paper>
    </Box>
    </AdminLayout>
  );
};

export default AttendanceEntry;