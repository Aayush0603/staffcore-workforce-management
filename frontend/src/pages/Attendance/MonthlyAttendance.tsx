import { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";

import {
  Box,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Menu,
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  getMonthlyAttendance,
} from "../../services/attendanceService";

interface AttendanceRow {
  id: number;
  employee_code: string;
  full_name: string;
  designation: string;
  attendance_date: string;
  status: string;
  total_hours: number;
  overtime_hours: number;
  fine_minutes: number;
  remarks: string;
}

const MonthlyAttendance = () => {

  const currentDate =
    new Date();

  const [month, setMonth] =
    useState(
      currentDate.getMonth() + 1
    );

  const [year, setYear] =
    useState(
      currentDate.getFullYear()
    );

  const [loading, setLoading] =
    useState(true);

  const [attendance, setAttendance] =
    useState<AttendanceRow[]>(
      []
    );

    const [anchorEl, setAnchorEl] =
  useState<null | HTMLElement>(
    null
  );

const openMenu =
  Boolean(anchorEl);

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance =
    async () => {

      try {

        setLoading(true);

        const response =
          await getMonthlyAttendance(
            month,
            year
          );

        setAttendance(
          response.data || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    const daysInMonth = new Date(
  year,
  month,
  0
).getDate();

const employees = Array.from(
  new Map(
    attendance.map((item) => [
      item.employee_code,
      {
        employee_code:
          item.employee_code,
        full_name:
          item.full_name,
        designation:
          item.designation,
      },
    ])
  ).values()
);

const handleMenuOpen = (
  event: React.MouseEvent<HTMLButtonElement>
) => {

  setAnchorEl(
    event.currentTarget
  );
};

const handleMenuClose = () => {

  setAnchorEl(null);
};

const getStatusForDay = (
  employeeCode: string,
  day: number
) => {

  const date =
    `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

  const record =
    attendance.find(
      (item) =>
        item.employee_code ===
          employeeCode &&
        item.attendance_date ===
          date
    );

  return record?.status || "-";
};

const getEmployeeSummary = (
  employeeCode: string
) => {

  const records =
    attendance.filter(
      (item) =>
        item.employee_code ===
        employeeCode
    );

  return {
    totalHours:
      records.reduce(
        (sum, item) =>
          sum +
          Number(
            item.total_hours || 0
          ),
        0
      ),

    present:
      records.filter(
        (item) =>
          item.status ===
          "PRESENT"
      ).length,

    absent:
      records.filter(
        (item) =>
          item.status ===
          "ABSENT"
      ).length,

    halfDay:
      records.filter(
        (item) =>
          item.status ===
          "HALF_DAY"
      ).length,

    paidLeave:
      records.filter(
        (item) =>
          item.status ===
          "PAID_LEAVE"
      ).length,

    unmarked:
      daysInMonth -
      records.length,

    overtime:
      records.reduce(
        (sum, item) =>
          sum +
          Number(
            item.overtime_hours || 0
          ),
        0
      ),

    fine:
      records.reduce(
        (sum, item) =>
          sum +
          Number(
            item.fine_minutes || 0
          ),
        0
      ),
  };
};

const exportToExcel = () => {

  const excelData = employees.map(
    (employee, index) => {

      const summary =
        getEmployeeSummary(
          employee.employee_code
        );

     const row: any = {};

row["Sr"] = index + 1;
row["Staff Code"] =
  employee.employee_code;
row["Staff Name"] =
  employee.full_name;
row["Staff Type"] =
  employee.designation;

      for (
  let day = 1;
  day <= daysInMonth;
  day++
) {
  row[
    String(day).padStart(
      2,
      "0"
    )
  ] =
    getStatusForDay(
      employee.employee_code,
      day
    );
}

    row["Total Hours"] =
  summary.totalHours;

row["Present"] =
  summary.present;

row["Absent"] =
  summary.absent;

row["Half Day"] =
  summary.halfDay;

row["Paid Leave"] =
  summary.paidLeave;

row["Unmarked"] =
  summary.unmarked;

row["OT Hours"] =
  summary.overtime;

row["Fine Minutes"] =
  summary.fine;

  row["Remarks"] =
  attendance
    .filter(
      (item) =>
        item.employee_code ===
        employee.employee_code
    )
    .map(
      (item) =>
        item.remarks || ""
    )
    .filter(Boolean)
    .join(", ");

      return row;
    }
  );

  const headers = [
  "Sr",
  "Staff Code",
  "Staff Name",
  "Staff Type",

  ...Array.from(
    { length: daysInMonth },
    (_, i) =>
      String(i + 1).padStart(
        2,
        "0"
      )
  ),

  "Total Hours",
  "Present",
  "Absent",
  "Half Day",
  "Paid Leave",
  "Unmarked",
  "OT Hours",
  "Fine Minutes",
  "Remarks",
];

const worksheet =
  XLSX.utils.json_to_sheet(
    excelData,
    {
      header: headers,
    }
  );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Attendance"
  );

  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

  const fileData =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  saveAs(
    fileData,
    `Attendance_${month}_${year}.xlsx`
  );
};

const exportToPDF = () => {

  const doc = new jsPDF(
    "landscape"
  );

  doc.setFontSize(16);

  doc.text(
    "Hospital Attendance Report",
    14,
    15
  );

  doc.setFontSize(10);

  doc.text(
    `Month: ${month}/${year}`,
    14,
    22
  );

  const tableData =
    employees.map(
      (
        employee,
        index
      ) => {

        const summary =
          getEmployeeSummary(
            employee.employee_code
          );

        return [
          index + 1,
          employee.employee_code,
          employee.full_name,
          employee.designation,
          summary.present,
          summary.absent,
          summary.halfDay,
          summary.overtime,
          summary.fine,
        ];
      }
    );

  autoTable(
    doc,
    {
      startY: 30,

      head: [[
        "Sr",
        "Code",
        "Name",
        "Type",
        "Present",
        "Absent",
        "Half Day",
        "OT",
        "Fine",
      ]],

      body:
        tableData,
    }
  );

  doc.save(
    `Attendance_${month}_${year}.pdf`
  );
};

  return (
    <AdminLayout>
      <Box sx={{ mt: 2 }}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            display: "flex",
            gap: 2,
          }}
        >

          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) =>
              setMonth(
                Number(
                  e.target.value
                )
              )
            }
            sx={{
              minWidth: 180,
            }}
          >
            {Array.from(
              { length: 12 },
              (_, i) => (
                <MenuItem
                  key={i + 1}
                  value={i + 1}
                >
                  {i + 1}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            label="Year"
            value={year}
            onChange={(e) =>
              setYear(
                Number(
                  e.target.value
                )
              )
            }
            sx={{
              width: 150,
            }}
          />

          <Button
  variant="contained"
  endIcon={
    <ArrowDropDownIcon />
  }
  onClick={handleMenuOpen}
>
  Download
</Button>

<Menu
  anchorEl={anchorEl}
  open={openMenu}
  onClose={handleMenuClose}
>
  <MenuItem
    onClick={() => {

      exportToExcel();

      handleMenuClose();
    }}
  >
    Excel
  </MenuItem>

  <MenuItem
    onClick={() => {

      exportToPDF();

      handleMenuClose();
    }}
  >
    PDF
  </MenuItem>
</Menu>
        </Paper>

        <Paper>

          {loading ? (

            <Box
              sx={{
                py: 5,
                display: "flex",
                justifyContent:
                  "center",
              }}
            >
              <CircularProgress />
            </Box>

          ) : (

           <TableContainer
  sx={{
    overflowX: "auto",
    maxWidth: "100%",
  }}
>

              <Table size="small">

  <TableHead>

    <TableRow>

      <TableCell
  sx={{
    position: "sticky",
    left: 0,
    top: 0,
    background: "#F8FAFC",
    zIndex: 4,
  }}
>
  Sr
</TableCell>

<TableCell
  sx={{
    position: "sticky",
    left: 60,
    top: 0,
    background: "#F8FAFC",
    zIndex: 4,
  }}
>
  Staff Code
</TableCell>

<TableCell
  sx={{
    position: "sticky",
    left: 170,
    top: 0,
    background: "#F8FAFC",
    zIndex: 4,
    minWidth: 200,
  }}
>
  Staff Name
</TableCell>

<TableCell
  sx={{
    position: "sticky",
    left: 370,
    top: 0,
    background: "#F8FAFC",
    zIndex: 4,
    minWidth: 150,
  }}
>
  Staff Type
</TableCell>

      {Array.from(
        { length: daysInMonth },
        (_, i) => (
          <TableCell
            key={i}
            align="center"
          >
            {i + 1}
          </TableCell>
        )
      )}

      <TableCell>
        Total Hrs
      </TableCell>

      <TableCell>P</TableCell>

      <TableCell>A</TableCell>

      <TableCell>HD</TableCell>

      <TableCell>PL</TableCell>

      <TableCell>UM</TableCell>

      <TableCell>OT</TableCell>

      <TableCell>Fine</TableCell>

    </TableRow>

  </TableHead>

  <TableBody>

    {employees.map(
      (
        employee,
        index
      ) => {

        const summary =
          getEmployeeSummary(
            employee.employee_code
          );

        return (

          <TableRow
            key={
              employee.employee_code
            }
          >

           <TableCell
  sx={{
    position: "sticky",
    left: 0,
    background: "#fff",
    zIndex: 3,
  }}
>
  {index + 1}
</TableCell>

            <TableCell
  sx={{
    position: "sticky",
    left: 60,
    background: "#fff",
    zIndex: 3,
  }}
>
  {employee.employee_code}
</TableCell>

            <TableCell
  sx={{
    position: "sticky",
    left: 170,
    background: "#fff",
    zIndex: 3,
    minWidth: 200,
  }}
>
  {employee.full_name}
</TableCell>

            <TableCell
  sx={{
    position: "sticky",
    left: 370,
    background: "#fff",
    zIndex: 3,
    minWidth: 150,
  }}
>
  {employee.designation}
</TableCell>

            {Array.from(
              {
                length:
                  daysInMonth,
              },
              (_, i) => (
                <TableCell
  key={i}
  align="center"
  sx={{
    fontWeight: 700,
    color:
      getStatusForDay(
        employee.employee_code,
        i + 1
      ) === "PRESENT"
        ? "#16A34A"
        : getStatusForDay(
            employee.employee_code,
            i + 1
          ) === "ABSENT"
        ? "#DC2626"
        : getStatusForDay(
            employee.employee_code,
            i + 1
          ) === "HALF_DAY"
        ? "#EA580C"
        : "#6B7280",
  }}
>
  {getStatusForDay(
    employee.employee_code,
    i + 1
  ) === "PRESENT"
    ? "P"
    : getStatusForDay(
        employee.employee_code,
        i + 1
      ) === "ABSENT"
    ? "A"
    : getStatusForDay(
        employee.employee_code,
        i + 1
      ) === "HALF_DAY"
    ? "HD"
    : "-"}
</TableCell>
              )
            )}

            <TableCell>
              {summary.totalHours.toFixed(
                2
              )}
            </TableCell>

            <TableCell>
              {summary.present}
            </TableCell>

            <TableCell>
              {summary.absent}
            </TableCell>

            <TableCell>
              {summary.halfDay}
            </TableCell>

            <TableCell>
              {summary.paidLeave}
            </TableCell>

            <TableCell>
              {summary.unmarked}
            </TableCell>

            <TableCell>
              {summary.overtime.toFixed(
                2
              )}
            </TableCell>

            <TableCell>
              {summary.fine}
            </TableCell>

          </TableRow>

        );
      }
    )}

  </TableBody>

</Table>

            </TableContainer>

          )}

        </Paper>

      </Box>

    </AdminLayout>
  );
};

export default MonthlyAttendance;