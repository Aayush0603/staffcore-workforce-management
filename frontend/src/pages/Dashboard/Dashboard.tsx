import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PaymentsIcon from "@mui/icons-material/Payments";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getDashboardStats } from "../../services/dashboardService";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

const Dashboard = () => {

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {

    const fetchStats =
      async () => {

        try {

          const data =
            await getDashboardStats();

          setStats(
            data.data
          );

        } catch (error) {

          console.error(
            error
          );
        }
      };

    fetchStats();

  }, []);

  if (!stats) {

    return (
      <AdminLayout>

        <Typography
          variant="h5"
        >
          Loading...
        </Typography>

      </AdminLayout>
    );
  }

  const cards = [
  {
    title: "Employees",
    value: stats.totalEmployees,
    icon: <PeopleAltIcon fontSize="large" />,
    color: "#0F766E",
  },

  {
    title: "Departments",
    value: stats.totalDepartments,
    icon: <BusinessIcon fontSize="large" />,
    color: "#2563EB",
  },

  {
    title: "Present Today",
    value: stats.presentToday,
    icon: <AccessTimeIcon fontSize="large" />,
    color: "#16A34A",
  },

  {
    title: "Pending Leaves",
    value: stats.pendingLeaves,
    icon: <EventBusyIcon fontSize="large" />,
    color: "#DC2626",
  },

  {
    title: "Payroll Records",
    value: stats.totalPayrolls,
    icon: <PaymentsIcon fontSize="large" />,
    color: "#7C3AED",
  },

  {
    title: "Salary Slips",
    value: stats.totalSalarySlips,
    icon: <DescriptionIcon fontSize="large" />,
    color: "#EA580C",
  },

  {
    title: "Approved Leaves",
    value: stats.approvedLeaves,
    icon: <CheckCircleIcon fontSize="large" />,
    color: "#059669",
  },
];

  const recentEmployees = [
  "Rahul Sharma",
  "Priya Patel",
  "Amit Kumar",
  "Sneha Joshi",
  "Rohan Desai",
];

const pendingRequests = [
  "Rahul - Sick Leave",
  "Priya - Casual Leave",
  "Amit - Annual Leave",
];

  return (
  <AdminLayout>

    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        Welcome Back 👋
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
      >
        StaffCore Workforce Dashboard
      </Typography>
    </Box>

    {/* KPI Cards */}

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
          xl: "repeat(7, 1fr)",
        },
        gap: 3,
      }}
    >
      {cards.map((card) => (
        <Paper
          key={card.title}
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 5,
            border: "1px solid #E5E7EB",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {card.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                }}
              >
                {card.value}
              </Typography>
            </Box>

            <Box
              sx={{
                color: card.color,
              }}
            >
              {card.icon}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>

    {/* Dashboard Widgets */}

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1fr 1fr 1fr",
        },
        gap: 3,
        mt: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 5,
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Recent Employees
        </Typography>

        <List>
          {recentEmployees.map(
            (employee, index) => (
              <ListItem
                key={index}
                sx={{ px: 0 }}
              >
                {employee}
              </ListItem>
            )
          )}
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 5,
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Attendance Summary
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Present: {stats.presentToday}
        </Typography>

        <Divider />

        <Typography sx={{ my: 2 }}>
          Absent: {
  Math.max(
    stats.totalEmployees -
    stats.presentToday,
    0
  )
}
        </Typography>

        <Divider />

        <Typography sx={{ mt: 2 }}>
          On Leave: {stats.approvedLeaves}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 5,
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Pending Leave Requests
        </Typography>

        <List>
          {pendingRequests.map(
            (leave, index) => (
              <ListItem
                key={index}
                sx={{ px: 0 }}
              >
                {leave}
              </ListItem>
            )
          )}
        </List>
      </Paper>
    </Box>

  </AdminLayout>
);
};

export default Dashboard;