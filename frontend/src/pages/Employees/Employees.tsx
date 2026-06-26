import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Chip,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { keyframes } from "@mui/system";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddIcon from "@mui/icons-material/Add";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import { getEmployees, deleteEmployee } from "../../services/employeeService";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);

  // Filter states
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const getMockEmployees = () => [
    {
      id: 901,
      employee_code: "E901",
      full_name: "Sarah Jones",
      department_name: "Engineering",
      designation: "Software Engineer",
      status: "ACTIVE",
    },
    {
      id: 902,
      employee_code: "E902",
      full_name: "Michael Smith",
      department_name: "Engineering",
      designation: "Project Manager",
      status: "ON_LEAVE",
    },
    {
      id: 903,
      employee_code: "E903",
      full_name: "Emily Davis",
      department_name: "HR",
      designation: "HR Manager",
      status: "ACTIVE",
    },
    {
      id: 904,
      employee_code: "E904",
      full_name: "David Lee",
      department_name: "Sales",
      designation: "Sales Lead",
      status: "INACTIVE",
    }
  ];

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      if (data && data.data && data.data.length > 0) {
        setEmployees(data.data);
      } else {
        setEmployees(getMockEmployees());
      }
    } catch (error) {
      console.error(error);
      setEmployees(getMockEmployees());
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  // Extract unique departments from employees
  const allDepartments = Array.from(new Set(employees.map(e => e.department_name).filter(Boolean)));

  // Handle Department Toggle
  const handleDeptToggle = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  // Handle Status Toggle
  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Filtering logic
  const filteredEmployees = employees.filter((emp) => {
    const matchDept = selectedDepartments.length === 0 || selectedDepartments.includes(emp.department_name);
    // Normalize status strings for matching
    const empStatus = emp.status || "ACTIVE";
    let mappedStatus = "Active";
    if (empStatus === "ACTIVE") mappedStatus = "Active";
    else if (empStatus === "INACTIVE") mappedStatus = "Inactive";
    else if (empStatus === "ON_LEAVE" || empStatus === "LEAVE") mappedStatus = "On Leave";
    else mappedStatus = empStatus; // fallback

    const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(mappedStatus);

    return matchDept && matchStatus;
  });

  return (
    <AdminLayout>
      <Box sx={{ animation: `${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`, display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>

        {/* KPI Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
          {/* Card 1: Total Employees */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", background: "#ffffff", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", color: "#3b82f6" }}>
              <PeopleAltIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Employees</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.25 }}>{employees.length}</Typography>
            </Box>
          </Paper>

          {/* Card 2: Active Employees */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", background: "#ffffff", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: "12px", background: "rgba(34, 197, 94, 0.1)", display: "flex", color: "#22c55e" }}>
              <CheckCircleIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Employees</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.25 }}>{employees.filter((e) => e.status === "ACTIVE").length}</Typography>
            </Box>
          </Paper>

          {/* Card 3: Inactive Employees */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", background: "#ffffff", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", display: "flex", color: "#ef4444" }}>
              <CancelIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Inactive Employees</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.25 }}>{employees.filter((e) => e.status !== "ACTIVE").length}</Typography>
            </Box>
          </Paper>
        </Box>

        {/* Header & Add Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Employee Directory
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/employees/add")}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: "8px",
              px: 3,
              py: 1,
              fontSize: "0.95rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "rgba(17, 94, 89, 0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(17, 94, 89, 0.3)",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(17, 94, 89, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(17, 94, 89, 0.95)",
                borderColor: "rgba(17, 94, 89, 0.5)",
                boxShadow: "0 6px 16px rgba(17, 94, 89, 0.3)",
              }
            }}
          >
            Add New Employee
          </Button>
        </Box>

        {/* Two-Column Layout */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexGrow: 1, pb: 2 }}>

          {/* Left Sidebar (Filters) */}
          <Paper elevation={0} sx={{
            width: "200px",
            flexShrink: 0,
            p: 2,
            borderRadius: "16px",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
            background: "#ffffff"
          }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 2, fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              FILTERS
            </Typography>

            <Typography sx={{ fontWeight: 700, color: "#334155", mb: 1, mt: 2, fontSize: "0.85rem" }}>
              Department
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox size="small" checked={selectedDepartments.length === 0} onChange={() => setSelectedDepartments([])} sx={{ p: 0.5, color: "#cbd5e1", '&.Mui-checked': { color: "#115e59" } }} />}
                label={<Typography sx={{ fontSize: "0.8rem", color: selectedDepartments.length === 0 ? "#0f172a" : "#64748b", fontWeight: selectedDepartments.length === 0 ? 600 : 500 }}>All Departments</Typography>}
              />
              {allDepartments.map(dept => (
                <FormControlLabel
                  key={dept as string}
                  control={<Checkbox size="small" checked={selectedDepartments.includes(dept as string)} onChange={() => handleDeptToggle(dept as string)} sx={{ p: 0.5, color: "#cbd5e1", '&.Mui-checked': { color: "#115e59" } }} />}
                  label={<Typography sx={{ fontSize: "0.8rem", color: selectedDepartments.includes(dept as string) ? "#0f172a" : "#64748b", fontWeight: selectedDepartments.includes(dept as string) ? 600 : 500 }}>{dept as string}</Typography>}
                />
              ))}
            </FormGroup>

            <Typography sx={{ fontWeight: 700, color: "#334155", mb: 1, mt: 2.5, fontSize: "0.85rem" }}>
              Status
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox size="small" checked={selectedStatuses.length === 0} onChange={() => setSelectedStatuses([])} sx={{ p: 0.5, color: "#cbd5e1", '&.Mui-checked': { color: "#115e59" } }} />}
                label={<Typography sx={{ fontSize: "0.8rem", color: selectedStatuses.length === 0 ? "#0f172a" : "#64748b", fontWeight: selectedStatuses.length === 0 ? 600 : 500 }}>All Status</Typography>}
              />
              {['Active', 'Inactive', 'On Leave'].map(status => (
                <FormControlLabel
                  key={status}
                  control={<Checkbox size="small" checked={selectedStatuses.includes(status)} onChange={() => handleStatusToggle(status)} sx={{ p: 0.5, color: "#cbd5e1", '&.Mui-checked': { color: "#115e59" } }} />}
                  label={<Typography sx={{ fontSize: "0.8rem", color: selectedStatuses.includes(status) ? "#0f172a" : "#64748b", fontWeight: selectedStatuses.includes(status) ? 600 : 500 }}>{status}</Typography>}
                />
              ))}
            </FormGroup>
          </Paper>

          {/* Right Content (Grid of Cards) */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" },
            gap: 2.5,
            flexGrow: 1,
            alignContent: "start"
          }}>
            {filteredEmployees.map((employee) => {
              const isStatusActive = employee.status === "ACTIVE";
              const isStatusOnLeave = employee.status === "ON_LEAVE" || employee.status === "LEAVE";

              let statusText = "Absent";
              let statusColor = "#ef4444";
              let statusBg = "rgba(239, 68, 68, 0.1)";

              if (isStatusActive) {
                statusText = "Active";
                statusColor = "#16a34a";
                statusBg = "rgba(22, 163, 74, 0.1)";
              } else if (isStatusOnLeave) {
                statusText = "On Leave";
                statusColor = "#d97706";
                statusBg = "rgba(217, 119, 6, 0.1)";
              }

              return (
                <Paper
                  key={employee.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    background: "#ffffff",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
                    position: "relative",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
                      borderColor: "rgba(203, 213, 225, 0.8)",
                      "& .hover-actions": {
                        opacity: 1,
                        visibility: "visible",
                      }
                    }
                  }}
                >
                  {/* Status Badge */}
                  <Chip
                    label={statusText}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      letterSpacing: "0.05em",
                      height: 22,
                      backgroundColor: statusBg,
                      color: statusColor,
                      border: "none",
                      px: 0.5,
                    }}
                  />

                  {/* Hover Actions (Edit/Delete symbol visible on top right on hover) */}
                  <Box
                    className="hover-actions"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      opacity: 0,
                      visibility: "hidden",
                      transition: "all 0.2s ease",
                      display: "flex",
                      gap: 0.5,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(4px)",
                      borderRadius: "8px",
                      p: 0.5,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 2,
                    }}
                  >
                    <Tooltip title="Edit Employee">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/employees/edit/${employee.id}`)}
                        sx={{ color: "#3b82f6", p: 0.75, "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" } }}
                      >
                        <EditRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Employee">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        sx={{ color: "#ef4444", p: 0.75, "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" } }}
                      >
                        <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
                    <Avatar
                      src={`https://i.pravatar.cc/150?u=${employee.id}`}
                      variant="rounded"
                      sx={{
                        width: 76,
                        height: 76,
                        borderRadius: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        backgroundColor: "#f1f5f9"
                      }}
                    />
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2, mb: 0.5, fontSize: "1.05rem" }}>
                        {employee.full_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mb: 0.25 }}>
                        {employee.designation || "No Designation"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                        {employee.department_name || "No Department"}
                      </Typography>
                    </Box>
                  </Box>

                </Paper>
              );
            })}

            {filteredEmployees.length === 0 && (
              <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8 }}>
                <Typography sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "1rem" }}>
                  No employees found matching the selected filters.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default Employees;