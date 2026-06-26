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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import { getEmployees } from "../../services/employeeService";

import {
  getShifts,
  assignShift,
  getShiftHistory,
} from "../../services/shiftService";

const ShiftManagement = () => {
  const [employees, setEmployees] =
    useState<any[]>([]);

  const [shifts, setShifts] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [openDialog, setOpenDialog] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<any>(null);

  const [shiftId, setShiftId] =
    useState("");

  const [historyOpen, setHistoryOpen] =
  useState(false);

  const [shiftHistory, setShiftHistory] =
  useState<any[]>([]);

  const [effectiveFrom, setEffectiveFrom] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const fetchEmployees = async () => {
    try {
      const response =
        await getEmployees();

      setEmployees(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShifts = async () => {
    try {
      const response =
        await getShifts();

      setShifts(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchShifts();
  }, []);

  const filteredEmployees =
    employees.filter((employee) =>
      employee.full_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const handleOpenDialog = (
    employee: any
  ) => {
    setSelectedEmployee(
      employee
    );

    setShiftId(
      employee.shift_id
        ? String(
            employee.shift_id
          )
        : ""
    );

    setOpenDialog(true);
  };

  const handleAssignShift =
    async () => {
      if (
        !selectedEmployee ||
        !shiftId
      ) {
        alert(
          "Please select a shift"
        );
        return;
      }

      try {
        await assignShift({
          employee_id:
            selectedEmployee.id,

          shift_id:
            Number(
              shiftId
            ),

          effective_from:
            effectiveFrom,
        });

        alert(
          "Shift assigned successfully"
        );

        setOpenDialog(
          false
        );

        fetchEmployees();

      } catch (error) {
        console.error(error);

        alert(
          "Failed to assign shift"
        );
      }
    };

    const handleViewHistory =
  async (employee: any) => {
    try {

      const response =
        await getShiftHistory(
          employee.id
        );

      setShiftHistory(
        response.data
      );

      setSelectedEmployee(
        employee
      );

      setHistoryOpen(
        true
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to fetch shift history"
      );
    }
  };

  return (
    <AdminLayout>

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
            border:
              "1px solid #E5E7EB",
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
            border:
              "1px solid #E5E7EB",
          }}
        >
          <Typography color="text.secondary">
            Assigned Shifts
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
                  e.shift_id
              ).length
            }
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border:
              "1px solid #E5E7EB",
          }}
        >
          <Typography color="text.secondary">
            Unassigned Employees
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
                  !e.shift_id
              ).length
            }
          </Typography>
        </Paper>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Search employee..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        sx={{ mb: 3 }}
      />

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
                Employee Name
              </TableCell>

              <TableCell>
                Department
              </TableCell>

              <TableCell>
                Current Shift
              </TableCell>

              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEmployees.map(
              (employee) => (
                <TableRow
                  key={
                    employee.id
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
                      employee.department_name
                    }
                  </TableCell>

                  <TableCell>
                    {employee.shift_name ||
                      "Not Assigned"}
                  </TableCell>

                  <TableCell>

  <Button
    variant="contained"
    size="small"
    sx={{ mr: 1 }}
    onClick={() =>
      handleOpenDialog(employee)
    }
  >
    {employee.shift_id
      ? "Change Shift"
      : "Assign Shift"}
  </Button>

  <Button
    size="small"
    variant="outlined"
    onClick={() =>
      handleViewHistory(employee)
    }
  >
    History
  </Button>

</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Assign Shift
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Employee"
            value={
              selectedEmployee?.full_name ||
              ""
            }
            disabled
            sx={{
              mt: 2,
              mb: 2,
            }}
          />

          <TextField
            select
            fullWidth
            label="Shift"
            value={shiftId}
            onChange={(e) =>
              setShiftId(
                e.target.value
              )
            }
            sx={{ mb: 2 }}
          >
            {shifts.map(
              (shift) => (
                <MenuItem
                  key={
                    shift.id
                  }
                  value={
                    shift.id
                  }
                >
                  {
                    shift.shift_name
                  }
                </MenuItem>
              )
            )}
          </TextField>

         <Box sx={{ mb: 2 }}>
  <Typography
    variant="body2"
    sx={{ mb: 1 }}
  >
    Effective From
  </Typography>

  <TextField
    type="date"
    fullWidth
    value={effectiveFrom}
    onChange={(e) =>
      setEffectiveFrom(
        e.target.value
      )
    }
  />
</Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenDialog(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleAssignShift
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={historyOpen}
  onClose={() =>
    setHistoryOpen(false)
  }
  fullWidth
  maxWidth="md"
>
  <DialogTitle>
    Shift History
  </DialogTitle>

  <DialogContent>

    <Typography
      sx={{ mb: 2 }}
    >
      Employee:
      {" "}
      {
        selectedEmployee?.full_name
      }
    </Typography>

    <Table>
      <TableHead>
        <TableRow>

          <TableCell>
            Shift
          </TableCell>

          <TableCell>
            From
          </TableCell>

          <TableCell>
            To
          </TableCell>

        </TableRow>
      </TableHead>

      <TableBody>

        {shiftHistory.map(
          (history) => (
            <TableRow
              key={history.id}
            >
              <TableCell>
                {
                  history.shift_name
                }
              </TableCell>

              <TableCell>
                {
                  history.effective_from
                }
              </TableCell>

              <TableCell>
                {history.effective_to
                  ? history.effective_to
                  : "Current"}
              </TableCell>
            </TableRow>
          )
        )}

      </TableBody>
    </Table>

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() =>
        setHistoryOpen(false)
      }
    >
      Close
    </Button>

  </DialogActions>
</Dialog>
    </AdminLayout>
  );
};

export default ShiftManagement;