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
  Chip,
  CircularProgress,
} from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import {
  getAttendance,
  updateAttendance,
} from "../../services/attendanceService";


interface AttendanceRecord {
  id: number;
  attendance_date: string;
  check_in: string;
  check_out: string;
  total_hours: number;
  overtime_hours: number;
  fine_minutes: number;
  status: string;
  remarks: string;
  employee_code: string;
  full_name: string;
  department_name: string;
}

const Attendance = () => {
  const [attendance, setAttendance] = useState<
    AttendanceRecord[]
  >([]);

  const [filteredAttendance, setFilteredAttendance] =
    useState<AttendanceRecord[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] =
  useState("");

  const [openDialog, setOpenDialog] =
  useState(false);

const [selectedAttendance, setSelectedAttendance] =
  useState<AttendanceRecord | null>(null);

const [editStatus, setEditStatus] =
  useState("");

const [editRemarks, setEditRemarks] =
  useState("");

const [editOvertime, setEditOvertime] =
  useState<number | string>(0);

const [editFineMinutes, setEditFineMinutes] =
  useState<number | string>(0);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await getAttendance();

      setAttendance(response.data || []);
      setFilteredAttendance(response.data || []);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {

  const filtered =
    attendance.filter((item) => {

      const matchesSearch =
        item.full_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesDate =
        !selectedDate ||
        item.attendance_date
          ?.split("T")[0] ===
          selectedDate;

      return (
        matchesSearch &&
        matchesDate
      );
    });

  setFilteredAttendance(
    filtered
  );

}, [
  search,
  selectedDate,
  attendance,
]);

  const totalRecords = attendance.length;

  const totalOvertime = attendance.reduce(
    (sum, item) =>
      sum + Number(item.overtime_hours || 0),
    0
  );

  const checkedOut = attendance.filter(
    (item) => item.check_out
  ).length;

  const checkedIn = totalRecords - checkedOut;

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
          Attendance Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          Track employee attendance and working
          hours
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
            >
              Total Records
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              {totalRecords}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
            >
              Checked In
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              {checkedIn}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
            >
              Checked Out
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              {checkedOut}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
            >
              Overtime Hours
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              {totalOvertime.toFixed(1)}
            </Typography>
          </Paper>
        </Box>

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
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      sx={{ minWidth: 300 }}
    />

    <TextField
  label="Attendance Date"
  type="date"
  value={selectedDate}
  onChange={(e) =>
    setSelectedDate(
      e.target.value
    )
  }
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
  sx={{ minWidth: 220 }}
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
                    Department
                  </TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>
                    Check In
                  </TableCell>
                  <TableCell>
                    Check Out
                  </TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>
                    Overtime
                  </TableCell>
                  <TableCell>
                  Fine Minutes
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAttendance.map(
                  (item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.employee_code}
                      </TableCell>

                      <TableCell>
                        {item.full_name}
                      </TableCell>

                      <TableCell>
                        {item.department_name}
                      </TableCell>

                      <TableCell>
                        {item.attendance_date}
                      </TableCell>

                      <TableCell>
                        {item.check_in
                          ? new Date(
                              item.check_in
                            ).toLocaleTimeString()
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {item.check_out
                          ? new Date(
                              item.check_out
                            ).toLocaleTimeString()
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {item.total_hours || 0}
                      </TableCell>

                      <TableCell>
                        {item.overtime_hours || 0}
                      </TableCell>
                      <TableCell>
                        {item.fine_minutes}
                      </TableCell>
                     <TableCell>
  <Chip
    label={
      item.status ||
      "PRESENT"
    }
    color={
      item.status ===
      "PRESENT"
        ? "success"
        : item.status ===
          "HALF_DAY"
        ? "warning"
        : item.status ===
          "ABSENT"
        ? "error"
        : "default"
    }
    size="small"
  />
</TableCell>

<TableCell>
 <Typography
  variant="body2"
  sx={{
    maxWidth: 180,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  {item.remarks || "-"}
</Typography>
</TableCell>

                      <TableCell>
  <IconButton
  onClick={() => {

    setSelectedAttendance(item);

    setEditStatus(
      item.status || ""
    );

    setEditRemarks(
  item.remarks || ""
);

 setEditOvertime(
      Number(
        item.overtime_hours || 0
      )
    );

setEditFineMinutes(
      Number(
        item.fine_minutes || 0
      )
    );

    setOpenDialog(true);
  }}
>
    <EditIcon />
  </IconButton>
</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
      <Dialog
  open={openDialog}
  onClose={() =>
    setOpenDialog(false)
  }
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    Attendance Correction
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      select
      label="Status"
      value={editStatus}
      onChange={(e) =>
        setEditStatus(
          e.target.value
        )
      }
      sx={{ mt: 2 }}
    >
      <MenuItem value="PRESENT">
        PRESENT
      </MenuItem>

      <MenuItem value="ABSENT">
        ABSENT
      </MenuItem>

      <MenuItem value="HALF_DAY">
        HALF DAY
      </MenuItem>

      <MenuItem value="PAID_LEAVE">
        PAID LEAVE
      </MenuItem>

      <MenuItem value="UNMARKED">
        UNMARKED
      </MenuItem>
    </TextField>

    <TextField
      fullWidth
      multiline
      rows={4}
      label="Remarks"
      value={editRemarks}
      onChange={(e) =>
        setEditRemarks(
          e.target.value
        )
      }
      sx={{ mt: 2 }}
    />

    <TextField
  fullWidth
  type="number"
  label="Overtime Hours"
  value={editOvertime}
  onChange={(e) =>
    setEditOvertime(
      e.target.value === ""
        ? ""
        : Number(e.target.value)
    )
  }
  sx={{ mt: 2 }}
/>

<TextField
  fullWidth
  type="number"
  label="Fine Minutes"
  value={editFineMinutes}
  onChange={(e) =>
    setEditFineMinutes(
      e.target.value === ""
        ? ""
        : Number(e.target.value)
    )
  }
  sx={{ mt: 2 }}
/>
  </DialogContent>

  <DialogActions>

  <Button
    onClick={() =>
      setOpenDialog(false)
    }
  >
    Cancel
  </Button>

  <Button
    variant="contained"
    onClick={async () => {

      try {

        if (!selectedAttendance)
          return;

        await updateAttendance(
          selectedAttendance.id,
          {
            status: editStatus,
            remarks: editRemarks,
            overtime_hours:
              Number(editOvertime || 0),
            fine_minutes:
              Number(editFineMinutes || 0),
          }
        );

        setOpenDialog(false);

        fetchAttendance();

        alert(
          "Attendance updated successfully"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to update attendance"
        );

      }
    }}
  >
    Save
  </Button>

</DialogActions>
</Dialog>
    </AdminLayout>
  );
};

export default Attendance;