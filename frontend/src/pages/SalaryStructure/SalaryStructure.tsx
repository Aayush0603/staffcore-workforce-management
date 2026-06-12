import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import {
  getEmployees,
} from "../../services/employeeService";

import {
  getSalaryStructures,
  createSalaryStructure,
  getSalaryHistory,
} from "../../services/salaryStructureService";

interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
}

interface SalaryStructure {
  id: number;
  employee_id: number;

  employee_code: string;
  full_name: string;

  basic_salary: number;
  hra: number;
  allowance: number;

  overtime_rate: number;

  pf: number;
  pt: number;
  lic: number;

  deduction: number;

  effective_from: string;
}

const SalaryStructure = () => {
  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [salaryStructures, setSalaryStructures] =
    useState<SalaryStructure[]>([]);

  const [open, setOpen] =
    useState(false);

  const [formData, setFormData] =
  useState({
    employee_id: "",

    basic_salary: "",
    hra: "",
    allowance: "",

    overtime_rate: "",

    pf: "",
    pt: "",
    lic: "",

    deduction: "",

    effective_from: "",
  });

const [historyOpen, setHistoryOpen] =
  useState(false);

const [salaryHistory, setSalaryHistory] =
  useState<any[]>([]);



  const fetchData = async () => {
    try {
      const employeeResponse =
        await getEmployees();

      setEmployees(
        employeeResponse.data || []
      );

      const salaryResponse =
        await getSalaryStructures();

      setSalaryStructures(
        salaryResponse.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await createSalaryStructure(
        formData
      );

      alert(
        "Salary structure created successfully"
      );

      setOpen(false);

     setFormData({
  employee_id: "",

  basic_salary: "",
  hra: "",
  allowance: "",

  overtime_rate: "",

  pf: "",
  pt: "",
  lic: "",

  deduction: "",

  effective_from: "",
});

      fetchData();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to save salary structure"
      );
    }
  };

  const handleViewHistory =
  async (
    employeeId: number
  ) => {

    try {

      const response =
        await getSalaryHistory(
          employeeId
        );

      setSalaryHistory(
        response.data
      );

      setHistoryOpen(true);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <AdminLayout>
      <Box>
        <Typography
  variant="h4"
  sx={{
    fontWeight: 700,
    mb: 3,
  }}
>
  Salary Structure
</Typography>

        <Button
          variant="contained"
          onClick={() =>
            setOpen(true)
          }
        >
          Add Salary Structure
        </Button>

        <Paper
          sx={{
            mt: 3,
            p: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Employee
                </TableCell>

                <TableCell>Basic</TableCell>

                <TableCell>HRA</TableCell>

                <TableCell>Allowance</TableCell>

                <TableCell>OT Rate</TableCell>

                <TableCell>PF</TableCell>

                <TableCell>PT</TableCell>

                <TableCell>LIC</TableCell>

                <TableCell>Deduction</TableCell>

                <TableCell>Effective From</TableCell>
                <TableCell>
  Actions
</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {salaryStructures.map(
                (item) => (
                  <TableRow
                    key={item.id}
                  >
                    <TableCell>
                      {
                        item.employee_code
                      }
                      {" - "}
                      {
                        item.full_name
                      }
                    </TableCell>

                    <TableCell>
                      ₹
                      {
                        item.basic_salary
                      }
                    </TableCell>

                    <TableCell>
                    ₹{item.hra}
                    </TableCell>

                    <TableCell>
                    ₹{item.allowance}
                    </TableCell>


                    <TableCell>
  ₹{item.overtime_rate}
</TableCell>

<TableCell>
  ₹{item.pf}
</TableCell>

<TableCell>
  ₹{item.pt}
</TableCell>

<TableCell>
  ₹{item.lic}
</TableCell>

<TableCell>
  ₹{item.deduction}
</TableCell>

                    <TableCell>
                      {
                        item.effective_from
                      }
                    </TableCell>

                    <TableCell>

  <Button
    size="small"
    variant="outlined"
    onClick={() =>
      handleViewHistory(
        item.employee_id
      )
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
          open={open}
          onClose={() =>
            setOpen(false)
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Add Salary Structure
          </DialogTitle>

          <DialogContent>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Employee"
              value={
                formData.employee_id
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employee_id:
                    e.target.value,
                })
              }
            >
              {employees.map(
                (emp) => (
                  <MenuItem
                    key={emp.id}
                    value={emp.id}
                  >
                    {
                      emp.employee_code
                    }
                    {" - "}
                    {
                      emp.full_name
                    }
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Basic Salary"
              value={
                formData.basic_salary
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basic_salary:
                    e.target.value,
                })
              }
            />

            <TextField
  fullWidth
  margin="normal"
  label="HRA"
  value={formData.hra}
  onChange={(e) =>
    setFormData({
      ...formData,
      hra: e.target.value,
    })
  }
/>

              <TextField
              fullWidth
              margin="normal"
              label="Allowance"
              value={
                formData.allowance
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  allowance:
                    e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              margin="normal"
              label="Overtime Rate"
              value={
                formData.overtime_rate
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overtime_rate:
                    e.target.value,
                })
              }
            />

            <TextField
  fullWidth
  margin="normal"
  label="PF"
  value={formData.pf}
  onChange={(e) =>
    setFormData({
      ...formData,
      pf: e.target.value,
    })
  }
/>

<TextField
  fullWidth
  margin="normal"
  label="PT"
  value={formData.pt}
  onChange={(e) =>
    setFormData({
      ...formData,
      pt: e.target.value,
    })
  }
/>

<TextField
  fullWidth
  margin="normal"
  label="LIC"
  value={formData.lic}
  onChange={(e) =>
    setFormData({
      ...formData,
      lic: e.target.value,
    })
  }
/>

            <TextField
              fullWidth
              margin="normal"
              label="Deduction"
              value={
                formData.deduction
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deduction:
                    e.target.value,
                })
              }
            />

           <TextField
  fullWidth
  margin="normal"
  label="Effective From"
  type="date"
  value={formData.effective_from}
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
  onChange={(e) =>
    setFormData({
      ...formData,
      effective_from:
        e.target.value,
    })
  }
/>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
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
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Salary Revision History
  </DialogTitle>

  <DialogContent>

    <Table>

      <TableHead>
        <TableRow>
          <TableCell>
            Effective From
          </TableCell>

          <TableCell>
            Basic Salary
          </TableCell>

          <TableCell>
            HRA
          </TableCell>

          <TableCell>
            Allowance
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>

        {salaryHistory.map(
          (row) => (
            <TableRow
              key={row.id}
            >
              <TableCell>
                {
                  row.effective_from
                }
              </TableCell>

              <TableCell>
                ₹{row.basic_salary}
              </TableCell>

              <TableCell>
                ₹{row.hra}
              </TableCell>

              <TableCell>
                ₹{row.allowance}
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
      </Box>
    </AdminLayout>
  );
};

export default SalaryStructure;