import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import {
  getPayrolls,
  generatePayroll,
  downloadPayrollExcel,
  downloadPayrollPdf,
} from "../../services/payrollService";

import {
  createPayrollAdjustment,
  recalculatePayroll,
  getAdjustmentByEmployee,
} from "../../services/payrollAdjustmentService";

interface PayrollRecord {
  id: number;
  employee_id: number;

  employee_code: string;
  full_name: string;
  
  payroll_month: number;
  payroll_year: number;

  gross_salary: number;
  payable_days: number;
  overtime_hours: number;

  basic: number;
  hra: number;
  other_allowance: number;

  system_overtime: number;
  bonus: number;
  special_allowance: number;
  electricity_bill: number;
 
  advance_amount: number;
 
  system_fine: number;

  total_earnings: number;
  total_deductions: number;

  net_pay_amount: number;

  minus_hra: number;
  plus_ot_difference: number;

  net_salary: number;
  remarks: string;
}

const Payroll = () => {

  const [payrolls, setPayrolls] =
    useState<PayrollRecord[]>([]);

  const [filteredPayrolls, setFilteredPayrolls] =
    useState<PayrollRecord[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
  useState(false);

  const [month, setMonth] =
  useState(new Date().getMonth() + 1);

  const [year, setYear] =
  useState(new Date().getFullYear());

  const [downloadAnchorEl, setDownloadAnchorEl] =
  useState<null | HTMLElement>(null);

  const openDownloadMenu =
  Boolean(downloadAnchorEl);

  const [openAdjustment, setOpenAdjustment] =
  useState(false);

const [selectedEmployee, setSelectedEmployee] =
useState<PayrollRecord | null>(null);

const [adjustmentData, setAdjustmentData] =
  useState({
    electricity_bill: 0,
    advance_amount: 0,
    bonus: 0,
    special_allowance: 0,
    remarks: "",
  });

  useEffect(() => {
  fetchPayrolls();
}, []);

  const fetchPayrolls = async () => {

  if (!month || !year) return;

  setLoading(true);

  try {
    const response =
      await getPayrolls(
        month,
        year
      );

    setPayrolls(response.data || []);
    setFilteredPayrolls(response.data || []);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const handleGeneratePayroll =
  async () => {

    try {

      await generatePayroll(
        month,
        year
      );

      alert(
        "Payroll generated successfully"
      );

      await fetchPayrolls();

    } catch (error: any) {

  console.error(error);

  alert(
    error?.response?.data?.message ||
    "Payroll generation failed"
  );

}
  };

  const handleOpenAdjustment =
  async (employee: any) => {

    setSelectedEmployee(employee);

    const response =
      await getAdjustmentByEmployee(
        employee.employee_id,
        month,
        year
      );

    const adjustment =
      response.data || {};

    setAdjustmentData({
      electricity_bill:
        adjustment.electricity_bill || 0,

      advance_amount:
        adjustment.advance_amount || 0,

      bonus:
        adjustment.bonus || 0,

      special_allowance:
        adjustment.special_allowance || 0,

      remarks:
        adjustment.remarks || "",
    });

    setOpenAdjustment(true);
};

const handleSaveAdjustment =
  async () => {

    if (saving) return;
    if (!selectedEmployee) return;

    setSaving(true);

    try {
      
      console.log("Saving adjustment", {
  employee_id: selectedEmployee.employee_id,
  payroll_month: month,
  payroll_year: year,
  ...adjustmentData,
});

await createPayrollAdjustment({
  employee_id:
    selectedEmployee.employee_id,

  payroll_month: month,
  payroll_year: year,

  electricity_bill:
    adjustmentData.electricity_bill,

  advance_amount:
    adjustmentData.advance_amount,

  bonus:
    adjustmentData.bonus,

  special_allowance:
    adjustmentData.special_allowance,

  remarks:
    adjustmentData.remarks,
});

      alert(
        "Adjustment saved successfully"
      );

      await recalculatePayroll(
  selectedEmployee.employee_id,
  month,
  year
);

      await fetchPayrolls();

      setOpenAdjustment(
        false
      );

   } catch (error) {

  console.error(error);

  alert(
    "Failed to save adjustment"
  );

} finally {

  setSaving(false);

}
  };

  useEffect(() => {
    const term = search.toLowerCase();

const filtered =
  payrolls.filter(
    (item) =>
      (item.full_name || "")
        .toLowerCase()
        .includes(term) ||

      (item.employee_code || "")
        .toLowerCase()
        .includes(term)
  );

    setFilteredPayrolls(filtered);
  }, [search, payrolls]);

  const handleDownloadExcel =
  async () => {

    try {

      const blob =
        await downloadPayrollExcel(
          month,
          year
        );

      const url =
        window.URL.createObjectURL(
          new Blob([blob])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `Payroll_${month}_${year}.xlsx`
      );

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to download Excel"
      );

    }
};

const handleDownloadMenuOpen = (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  setDownloadAnchorEl(
    event.currentTarget
  );
};

const handleDownloadMenuClose = () => {
  setDownloadAnchorEl(null);
};

const handleDownloadPdf =
  async () => {

    try {

      const blob =
        await downloadPayrollPdf(
          month,
          year
        );

      const url =
        window.URL.createObjectURL(
          new Blob([blob])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Payroll_${month}_${year}.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to download PDF"
      );

    }
};


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
          Payroll Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          Manage employee salary
          records
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
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
<TextField
  select
  label="Month"
  value={month}
  onChange={(e) =>
    setMonth(Number(e.target.value))
  }
  sx={{ width: 220 }}
>
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
          Number(e.target.value)
        )
      }
      sx={{ width: 150 }}
    />

    <Button
  variant="contained"
  onClick={handleGeneratePayroll}
>
  Generate Payroll
</Button>

<Button
  variant="outlined"
  onClick={fetchPayrolls}
>
  View Payroll
</Button>

<Button
  variant="contained"
  onClick={handleDownloadMenuOpen}
>
  Download
</Button>

<Menu
  anchorEl={downloadAnchorEl}
  open={openDownloadMenu}
  onClose={handleDownloadMenuClose}
>
  <MenuItem
    onClick={() => {
      handleDownloadExcel();
      handleDownloadMenuClose();
    }}
  >
    Excel
  </MenuItem>

  <MenuItem
    onClick={() => {
      handleDownloadPdf();
      handleDownloadMenuClose();
    }}
  >
    PDF
  </MenuItem>
</Menu>
  </Box>
</Paper>

        <Paper
          sx={{
            p: 3,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            label="Search Employee"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </Paper>

        <Paper sx={{ p: 2 }}>

<Box
  sx={{
    overflowX: "auto",
  }}
>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table>

  <TableHead>

    <TableRow>

      <TableCell>Employee</TableCell>

      <TableCell>Gross Salary</TableCell>

      <TableCell>Payable Days</TableCell>

      <TableCell>Basic</TableCell>

      <TableCell>HRA</TableCell>

     <TableCell>Fixed Allowance</TableCell>

      <TableCell>OT Hours</TableCell>

      <TableCell>System OT</TableCell>

      <TableCell>Bonus</TableCell>

      <TableCell>Electricity</TableCell>

      <TableCell>Advance</TableCell>

      <TableCell>System Fine</TableCell>

      <TableCell>Total Earnings</TableCell>

      <TableCell>Total Deductions</TableCell>

      <TableCell>Net Salary</TableCell>

      <TableCell>Action</TableCell>

    </TableRow>

  </TableHead>

  <TableBody>
                {filteredPayrolls.map(
                  (item) => (
                    <TableRow
                      key={item.id}
                    >
<TableCell>
  <Box>
  <Typography
  sx={{
    fontWeight: 600,
  }}
>
  {item.full_name}
</Typography>

  <Typography
    variant="caption"
    color="text.secondary"
  >
    {item.employee_code}
  </Typography>
</Box>
</TableCell>

<TableCell>
₹{Number(item.gross_salary || 0).toFixed(2)}
</TableCell>

<TableCell>
  {item.payable_days}
</TableCell>

<TableCell>
  ₹{Number(item.basic || 0).toFixed(2)}
</TableCell>

<TableCell>
 ₹{Number(item.hra || 0).toFixed(2)}
</TableCell>

<TableCell>
  ₹{Number(item.other_allowance || 0).toFixed(2)}
</TableCell>

<TableCell>
  {item.overtime_hours}
</TableCell>

<TableCell>
 ₹{Number(item.system_overtime || 0).toFixed(2)}
</TableCell>

<TableCell>
  ₹{Number(item.bonus || 0).toFixed(2)}
</TableCell>

<TableCell>
 ₹{Number(item.electricity_bill || 0).toFixed(2)}
</TableCell>

<TableCell>
  ₹{Number(item.advance_amount || 0).toFixed(2)}
</TableCell>

<TableCell>
 ₹{Number(item.system_fine || 0).toFixed(2)}
</TableCell>

<TableCell>
  ₹{Number(item.total_earnings || 0).toFixed(2)}
</TableCell>

<TableCell>
 ₹{Number(item.total_deductions || 0).toFixed(2)}
</TableCell>

<TableCell
  sx={{
    fontWeight: 700,
    color: "#16A34A",
  }}
>
  ₹{Number(
    item.net_salary
  ).toFixed(2)}
</TableCell>

<TableCell>

  <Button
    size="small"
    variant="outlined"
    onClick={() =>
      handleOpenAdjustment(
        item
      )
    }
  >
    Edit
  </Button>

</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
          </Box>
        </Paper>
      </Box>

      <Dialog
  open={openAdjustment}
  onClose={() =>
    setOpenAdjustment(false)
  }
  maxWidth="sm"
  fullWidth
>

  <DialogTitle>
    Payroll Adjustment
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      margin="normal"
      label="Electricity Bill"
      value={
        adjustmentData.electricity_bill
      }
      onChange={(e) =>
    setAdjustmentData({
      ...adjustmentData,
      electricity_bill:
        e.target.value === ""
          ? 0
          : Number(e.target.value),
    })
  }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Advance Amount"
      value={
        adjustmentData.advance_amount
      }
      onChange={(e) =>
    setAdjustmentData({
      ...adjustmentData,
      advance_amount:
        e.target.value === ""
          ? 0
          : Number(e.target.value),
    })
  }
    />

    <TextField
      fullWidth
      margin="normal"
      label="Bonus"
      value={
  Number.isNaN(adjustmentData.bonus)
    ? 0
    : adjustmentData.bonus
}
      onChange={(e) =>
  setAdjustmentData({
    ...adjustmentData,
    bonus:
      e.target.value === ""
        ? 0
        : Number(e.target.value),
  })
}
    />

    <TextField
  fullWidth
  margin="normal"
  label="Special Allowance"
  value={adjustmentData.special_allowance}
  onChange={(e) =>
    setAdjustmentData({
      ...adjustmentData,
      special_allowance:
        e.target.value === ""
          ? 0
          : Number(e.target.value),
    })
  }
/>

    <TextField
      fullWidth
      margin="normal"
      multiline
      rows={3}
      label="Remarks"
      value={
        adjustmentData.remarks
      }
      onChange={(e) =>
        setAdjustmentData({
          ...adjustmentData,
          remarks:
            e.target.value,
        })
      }
    />

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() =>
        
        setOpenAdjustment(false)
      }
    >
      Cancel
    </Button>

    <Button
  variant="contained"
  disabled={saving}
  onClick={handleSaveAdjustment}
>
  {saving ? "Saving..." : "Save"}
</Button>

  </DialogActions>

</Dialog>
    </AdminLayout>
  );
};

export default Payroll;