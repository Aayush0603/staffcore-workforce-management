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
  Button,
  MenuItem,
  IconButton,
  InputAdornment,
  TableContainer,
  Pagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

const staticAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    attendance_date: "2023-10-25T00:00:00Z",
    check_in: "2023-10-25T09:00:00Z",
    check_out: "2023-10-25T18:00:00Z",
    total_hours: 9,
    overtime_hours: 1,
    fine_minutes: 0,
    status: "PRESENT",
    remarks: "On time",
    employee_code: "EMP001",
    full_name: "John Doe",
    department_name: "Engineering",
  },
  {
    id: 2,
    attendance_date: "2023-10-25T00:00:00Z",
    check_in: "2023-10-25T09:30:00Z",
    check_out: "2023-10-25T18:00:00Z",
    total_hours: 8.5,
    overtime_hours: 0,
    fine_minutes: 30,
    status: "PRESENT",
    remarks: "Late arrival",
    employee_code: "EMP002",
    full_name: "Jane Smith",
    department_name: "Marketing",
  },
  {
    id: 3,
    attendance_date: "2023-10-25T00:00:00Z",
    check_in: "",
    check_out: "",
    total_hours: 0,
    overtime_hours: 0,
    fine_minutes: 0,
    status: "ABSENT",
    remarks: "Sick leave",
    employee_code: "EMP003",
    full_name: "Alice Johnson",
    department_name: "Sales",
  },
  {
    id: 4,
    attendance_date: "2023-10-25T00:00:00Z",
    check_in: "2023-10-25T08:50:00Z",
    check_out: "2023-10-25T19:00:00Z",
    total_hours: 10.16,
    overtime_hours: 2.16,
    fine_minutes: 0,
    status: "PRESENT",
    remarks: "Extra work",
    employee_code: "EMP004",
    full_name: "Bob Brown",
    department_name: "Engineering",
  },
  {
    id: 5,
    attendance_date: "2023-10-26T00:00:00Z",
    check_in: "2023-10-26T09:05:00Z",
    check_out: "2023-10-26T18:05:00Z",
    total_hours: 9,
    overtime_hours: 1,
    fine_minutes: 5,
    status: "PRESENT",
    remarks: "",
    employee_code: "EMP001",
    full_name: "John Doe",
    department_name: "Engineering",
  }
];

const Attendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [editOvertime, setEditOvertime] = useState<number | string>(0);
  const [editFineMinutes, setEditFineMinutes] = useState<number | string>(0);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      // const response = await getAttendance();
      // setAttendance(response.data || []);
      // setFilteredAttendance(response.data || []);
      
      // Using static data for now until backend is added
      setTimeout(() => {
        setAttendance(staticAttendanceData);
        setFilteredAttendance(staticAttendanceData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = attendance.filter((item) => {
      const matchesSearch = item.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                            item.employee_code?.toLowerCase().includes(search.toLowerCase());
      const matchesDate = !selectedDate || item.attendance_date?.split("T")[0] === selectedDate;
      return matchesSearch && matchesDate;
    });
    setFilteredAttendance(filtered);
    setPage(1); // Reset page on filter
  }, [search, selectedDate, attendance]);

  const totalRecords = attendance.length;
  const totalOvertime = attendance.reduce((sum, item) => sum + Number(item.overtime_hours || 0), 0);
  const checkedIn = attendance.filter((item) => item.check_in).length;

  const formatHours = (hours: number | string) => {
    const h = Number(hours) || 0;
    const whole = Math.floor(h);
    const mins = Math.round((h - whole) * 60);
    return `${whole}h ${mins}m`;
  };

  const paginatedAttendance = filteredAttendance.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredAttendance.length / rowsPerPage);

  const startEntry = (page - 1) * rowsPerPage + 1;
  const endEntry = Math.min(page * rowsPerPage, filteredAttendance.length);

  return (
    <AdminLayout>
      <Box sx={{ mt: 2, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5, mb: 1, display: 'block' }}>
              TOTAL RECORDS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
              {totalRecords}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5, mb: 1, display: 'block' }}>
                CHECKED IN
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                {checkedIn}
              </Typography>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', backgroundColor: '#e8f5e9' }}>
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5, mb: 1, display: 'block' }}>
              OVERTIME HOURS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
              {totalOvertime.toFixed(1)}
            </Typography>
          </Paper>
        </Box>

        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: 'center' }}>
            <TextField
              placeholder="Search Employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 280, backgroundColor: '#fafafa', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #c4c4c4', borderRadius: 1, px: 1.5, backgroundColor: '#fff', height: 40, '&:hover': { borderColor: '#000' } }}>
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 500, whiteSpace: 'nowrap' }}>
                Attendance Date:
              </Typography>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { p: 0, color: '#333', fontSize: '0.875rem', fontFamily: 'inherit' } }}
              />
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Button variant="contained" sx={{ borderRadius: 1.5, textTransform: 'none', px: 3, py: 1, backgroundColor: '#3b82f6', boxShadow: 'none', '&:hover': { backgroundColor: '#2563eb', boxShadow: 'none' }, fontWeight: 600 }}>
              Filter
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#ffffff' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Employee Code</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Employee Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Check In</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Check Out</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Total Hours</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Overtime</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2 }}>Remarks</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#333', borderBottom: '2px solid #f0f0f0', py: 2, width: 60 }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedAttendance.map((item, index) => (
                      <TableRow key={item.id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f7f9' : '#ffffff', '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#444' }}>{item.employee_code}</TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#111', fontWeight: 500 }}>{item.full_name}</TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#555' }}>{item.department_name}</TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#555' }}>
                          {item.attendance_date ? item.attendance_date.split("T")[0] : "-"}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#222', fontWeight: 500 }}>
                          {item.check_in ? new Date(item.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#222', fontWeight: 500 }}>
                          {item.check_out ? new Date(item.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#555' }}>
                          {formatHours(item.total_hours)}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#555' }}>
                          {formatHours(item.overtime_hours)}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.status === 'PRESENT' ? '#10b981' : item.status === 'ABSENT' ? '#ef4444' : '#f59e0b' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : 'Present'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#555' }}>
                          <Typography variant="body2" sx={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.remarks || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedAttendance(item);
                              setEditStatus(item.status || "");
                              setEditRemarks(item.remarks || "");
                              setEditOvertime(Number(item.overtime_hours || 0));
                              setEditFineMinutes(Number(item.fine_minutes || 0));
                              setOpenDialog(true);
                            }}
                            sx={{ color: '#aaa', '&:hover': { color: '#1976d2' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedAttendance.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={11} align="center" sx={{ py: 4, color: '#888' }}>
                          No records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Showing {filteredAttendance.length > 0 ? startEntry : 0} to {endEntry} of {totalRecords} entries
                </Typography>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(_, value) => setPage(value)} 
                  shape="rounded" 
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600,
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                      }
                    }
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Attendance Correction</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} sx={{ mt: 2 }}>
            <MenuItem value="PRESENT">PRESENT</MenuItem>
            <MenuItem value="ABSENT">ABSENT</MenuItem>
            <MenuItem value="HALF_DAY">HALF DAY</MenuItem>
            <MenuItem value="PAID_LEAVE">PAID LEAVE</MenuItem>
            <MenuItem value="UNMARKED">UNMARKED</MenuItem>
          </TextField>
          <TextField fullWidth multiline rows={4} label="Remarks" value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} sx={{ mt: 2 }} />
          <TextField fullWidth type="number" label="Overtime Hours" value={editOvertime} onChange={(e) => setEditOvertime(e.target.value === "" ? "" : Number(e.target.value))} sx={{ mt: 2 }} />
          <TextField fullWidth type="number" label="Fine Minutes" value={editFineMinutes} onChange={(e) => setEditFineMinutes(e.target.value === "" ? "" : Number(e.target.value))} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 600, color: '#666' }}>Cancel</Button>
          <Button
            variant="contained"
            disableElevation
            onClick={async () => {
              try {
                if (!selectedAttendance) return;
                await updateAttendance(selectedAttendance.id, {
                  status: editStatus,
                  remarks: editRemarks,
                  overtime_hours: Number(editOvertime || 0),
                  fine_minutes: Number(editFineMinutes || 0),
                });
                setOpenDialog(false);
                fetchAttendance();
              } catch (error) {
                console.error(error);
                alert("Failed to update attendance");
              }
            }}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Attendance;