import { useEffect, useState } from "react";
import {
  Box,
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
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  department?: string;
  payroll_month: number;
  payroll_year: number;
  net_salary: number;
}

const staticSlips: SalarySlip[] = [
  { id: 1, employee_code: "EMP001", full_name: "John Doe", department: "Engineering", designation: "Software Engineer", payroll_month: 4, payroll_year: 2024, net_salary: 4850 },
  { id: 2, employee_code: "EMP002", full_name: "Jaran Carea", department: "Admin", designation: "Administrator", payroll_month: 4, payroll_year: 2024, net_salary: 1500 },
  { id: 3, employee_code: "EMP003", full_name: "Airian Fadey", department: "Sales", designation: "Sales Exec", payroll_month: 4, payroll_year: 2024, net_salary: 1000 },
  { id: 4, employee_code: "EMP004", full_name: "Saran Hanny", department: "Support", designation: "Support Specialist", payroll_month: 4, payroll_year: 2024, net_salary: 1000 },
  { id: 5, employee_code: "EMP005", full_name: "Jaran Midnam", department: "Engineering", designation: "Lead Engineer", payroll_month: 4, payroll_year: 2024, net_salary: 5500 },
];

const recentRuns = [
  { month: "June 2024", processed: "05/06/2024", employees: 120, total: 350000 },
  { month: "May 2024", processed: "05/05/2024", employees: 150, total: 450000 },
  { month: "April 2024", processed: "05/04/2024", employees: 150, total: 450000 },
];

const getMonthName = (monthNum: number) => {
  const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[monthNum] || "";
};

const glassmorphicStyle = {
  p: 2.5,
  borderRadius: 3,
  backgroundColor: "rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
};

const tealButtonStyle = {
  backgroundColor: "rgba(17, 94, 89, 0.85)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(17, 94, 89, 0.3)",
  color: "#ffffff",
  borderRadius: 2,
  px: 2.5,
  py: 1.2,
  fontSize: "0.85rem",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(17, 94, 89, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(17, 94, 89, 0.95)",
    borderColor: "rgba(17, 94, 89, 0.5)",
    boxShadow: "0 6px 16px rgba(17, 94, 89, 0.3)",
  },
};

const SalarySlips = () => {
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");

  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    fetchSalarySlips();
  }, []);

  const fetchSalarySlips = async () => {
    try {
      const response = await getSalarySlips();
      if (response.data && response.data.length > 0) {
        setSalarySlips(response.data);
      } else {
        setSalarySlips(staticSlips);
      }
    } catch (error) {
      console.error(error);
      setSalarySlips(staticSlips);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalarySlips = salarySlips.filter((slip) => {
    const matchesSearch =
      slip.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.employee_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = month === "" || slip.payroll_month === month;
    const matchesYear = year === "" || slip.payroll_year === year;

    return matchesSearch && matchesMonth && matchesYear;
  });

  const handleQuickView = (slip: SalarySlip) => {
    setSelectedSlip(slip);
    setQuickViewOpen(true);
  };

  // Mock calculation for quick view details
  const getMockDetails = (netSalary: number) => {
    const basic = Math.round(netSalary * 0.6);
    const hra = Math.round(netSalary * 0.3);
    const special = Math.round(netSalary * 0.23);
    const totalEarnings = basic + hra + special;
    const pf = Math.round(totalEarnings * 0.05);
    const tax = Math.round(totalEarnings * 0.1);
    const totalDeductions = pf + tax;
    const net = totalEarnings - totalDeductions;
    return { basic, hra, special, totalEarnings, pf, tax, totalDeductions, net };
  };

  return (
    <AdminLayout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", pt: 1, pb: 4 }}>
        
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", letterSpacing: '-0.5px' }}>
            Salary Slips
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search Employee by Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 280, backgroundColor: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              select
              value={month}
              onChange={(e) => setMonth(e.target.value === "" ? "" : Number(e.target.value))}
              size="small"
              displayEmpty
              sx={{ width: 120, backgroundColor: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Month</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <MenuItem key={m} value={m}>{getMonthName(m)}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              value={year}
              onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
              size="small"
              displayEmpty
              sx={{ width: 100, backgroundColor: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">Year</MenuItem>
              {[2023, 2024, 2025].map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </TextField>
            <Button startIcon={<DownloadIcon />} sx={tealButtonStyle}>
              Generate Report
            </Button>
          </Box>
        </Box>

        {/* Recent Payroll Runs */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: "#111827" }}>
            Recent Payroll Runs
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
            {recentRuns.map((run, index) => (
              <Paper key={index} elevation={0} sx={{ ...glassmorphicStyle, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827", mb: 0.5 }}>
                  {run.month} Payroll
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 0.5, fontWeight: 500 }}>
                  Processed on {run.processed}
                </Typography>
                <Typography variant="body2" sx={{ color: "#374151", mb: 2.5, fontWeight: 500 }}>
                  {run.employees} Employees - Total Net Pay: ${run.total.toLocaleString()}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    mt: 'auto', 
                    alignSelf: 'flex-start',
                    borderRadius: 2, 
                    textTransform: 'none', 
                    color: '#115e59', 
                    borderColor: 'rgba(17, 94, 89, 0.3)', 
                    fontWeight: 600,
                    px: 2,
                    '&:hover': { borderColor: '#115e59', backgroundColor: 'rgba(17, 94, 89, 0.04)' } 
                  }}
                >
                  View Details
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Slips Table */}
        <Paper elevation={0} sx={{ ...glassmorphicStyle, p: 0, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: '#115e59' }} />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Net Salary</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#4b5563', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSalarySlips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#6b7280' }}>
                      No salary slips found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSalarySlips.map((slip, index) => (
                    <TableRow 
                      key={slip.id} 
                      hover
                      sx={{ 
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(249, 250, 251, 0.5)',
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleQuickView(slip)}
                    >
                      <TableCell sx={{ py: 1.5, color: '#374151', fontWeight: 500 }}>{slip.employee_code}</TableCell>
                      <TableCell sx={{ py: 1.5, color: '#111827', fontWeight: 600 }}>{slip.full_name}</TableCell>
                      <TableCell sx={{ py: 1.5, color: '#4b5563' }}>{slip.department || 'Department'}</TableCell>
                      <TableCell sx={{ py: 1.5, color: '#4b5563' }}>{slip.designation}</TableCell>
                      <TableCell sx={{ py: 1.5, color: '#4b5563' }}>{getMonthName(slip.payroll_month)} {slip.payroll_year}</TableCell>
                      <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#111827' }}>
                        ${Number(slip.net_salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={(e) => { e.stopPropagation(); handleQuickView(slip); }}
                          sx={{ textTransform: 'none', color: '#115e59', fontWeight: 600 }}
                        >
                          Quick View
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

      {/* Quick View Modal */}
      <Dialog 
        open={quickViewOpen} 
        onClose={() => setQuickViewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
        }}
      >
        {selectedSlip && (() => {
          const details = getMockDetails(selectedSlip.net_salary);
          return (
            <>
              <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                  Quick View: {selectedSlip.full_name} - {getMonthName(selectedSlip.payroll_month)} {selectedSlip.payroll_year} Slip
                </Typography>
                <IconButton onClick={() => setQuickViewOpen(false)} sx={{ color: '#9ca3af' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0, borderColor: '#f3f4f6' }}>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#4b5563', fontWeight: 500 }}>Basic Salary:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 600 }}>${details.basic.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#4b5563', fontWeight: 500 }}>HRA:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 600 }}>${details.hra.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#4b5563', fontWeight: 500 }}>Special Allowance:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 600 }}>${details.special.toLocaleString()}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1.5, backgroundColor: 'rgba(243, 244, 246, 0.5)', borderRadius: 2 }}>
                    <Typography sx={{ color: '#111827', fontWeight: 700 }}>Total Earnings:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 700 }}>${details.totalEarnings.toLocaleString()}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#4b5563', fontWeight: 500 }}>PF:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 600 }}>${details.pf.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#4b5563', fontWeight: 500 }}>Tax:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 600 }}>${details.tax.toLocaleString()}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1.5, backgroundColor: 'rgba(243, 244, 246, 0.5)', borderRadius: 2 }}>
                    <Typography sx={{ color: '#111827', fontWeight: 700 }}>Total Deductions:</Typography>
                    <Typography sx={{ color: '#111827', fontWeight: 700 }}>${details.totalDeductions.toLocaleString()}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, p: 2, backgroundColor: 'rgba(17, 94, 89, 0.05)', borderRadius: 2, border: '1px solid rgba(17, 94, 89, 0.1)' }}>
                    <Typography sx={{ color: '#111827', fontWeight: 800, fontSize: '1.1rem' }}>Net Pay:</Typography>
                    <Typography sx={{ color: '#115e59', fontWeight: 800, fontSize: '1.1rem' }}>${details.net.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2.5, flexDirection: 'column', gap: 1.5 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<DownloadIcon />}
                  sx={{ ...tealButtonStyle, width: '100%', py: 1.5, fontSize: '1rem' }}
                  onClick={() => {
                    downloadSalarySlip(selectedSlip.id);
                  }}
                >
                  Download PDF
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined"
                  onClick={() => setQuickViewOpen(false)}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    color: '#4b5563', 
                    borderColor: '#d1d5db',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { backgroundColor: '#f9fafb', borderColor: '#9ca3af' }
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>
    </AdminLayout>
  );
};

export default SalarySlips;