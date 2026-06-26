import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import CalculateIcon from "@mui/icons-material/Calculate";

import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboardService";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Mon", Present: 210, Absent: 10, OnLeave: 20 },
  { name: "Tue", Present: 215, Absent: 8, OnLeave: 17 },
  { name: "Wed", Present: 220, Absent: 5, OnLeave: 15 },
  { name: "Thu", Present: 225, Absent: 5, OnLeave: 10 },
  { name: "Fri", Present: 230, Absent: 4, OnLeave: 6 },
  { name: "Sat", Present: 150, Absent: 20, OnLeave: 70 },
];

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.data);
      } catch (error) {
        console.error(error);
        // Fallback mock stats if backend is unavailable so the UI can still be previewed
        setStats({
          totalEmployees: 245,
          presentToday: 230,
        });
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <Typography variant="h5">Loading...</Typography>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "TOTAL EMPLOYEES",
      value: stats.totalEmployees,
      icon: <PeopleIcon sx={{ color: "#ffffff", fontSize: 20 }} />,
    },
    {
      title: "ACTIVE EMPLOYEES",
      value: stats.presentToday, // Using presentToday as active/present today
      icon: <PeopleIcon sx={{ color: "#ffffff", fontSize: 20 }} />,
    },
    {
      title: "ON LEAVE TODAY",
      value: 5, // Mock data based on screenshot
      icon: <AssignmentIcon sx={{ color: "#ffffff", fontSize: 20 }} />,
    },
  ];

  return (
    <AdminLayout>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", minHeight: 0 }}>
        
        {/* KPI Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: 2.5,
            mb: 2,
          }}
        >
          {cards.map((card) => (
            <Paper
              key={card.title}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 700, color: "#4b5563", mb: 0, letterSpacing: "0.5px", lineHeight: 1.5 }}
              >
                {card.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827" }}>
                {card.value}
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "#115e59",
                  borderRadius: 2,
                  p: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => navigate("/employees")}
              sx={{
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
              }}
            >
              Add New Employee
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalculateIcon fontSize="small" />}
              onClick={() => navigate("/payroll")}
              sx={{
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
              }}
            >
              Generate Payroll
            </Button>
          </Box>
        </Box>

        {/* Daily Attendance Trends Chart */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#111827", flexShrink: 0 }}>
            Daily Attendance
          </Typography>
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 14 }} dx={-10} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="square" 
                  wrapperStyle={{ top: -50, right: 0 }} 
                />
                <Bar dataKey="Present" fill="#115e59" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Absent" fill="#86efac" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="OnLeave" name="On Leave" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

      </Box>
    </AdminLayout>
  );
};

export default Dashboard;