import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentsIcon from "@mui/icons-material/Payments";

import { useNavigate } from "react-router-dom";

import { getDashboardStats } from "../../services/dashboardService";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

const Dashboard = () => {

  const [stats, setStats] =
    useState<any>(null);

  const navigate =
    useNavigate();

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
        <Typography variant="h5">
          Loading...
        </Typography>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "Employees",
      value: stats.totalEmployees,
      icon: (
        <PeopleAltIcon
          fontSize="large"
        />
      ),
      color: "#0F766E",
    },

    {
      title: "Present Today",
      value: stats.presentToday,
      icon: (
        <AccessTimeIcon
          fontSize="large"
        />
      ),
      color: "#16A34A",
    },

    {
  title: "Absent Today",
  value: stats.absentToday,
  icon: (
    <AccessTimeIcon
      fontSize="large"
    />
  ),
  color: "#DC2626",
},

    {
      title: "Monthly Payroll",
      value: `₹${stats.monthlyPayroll.toLocaleString(
        "en-IN"
      )}`,
      icon: (
        <PaymentsIcon
          fontSize="large"
        />
      ),
      color: "#7C3AED",
    },
  ];

  return (
    <AdminLayout>

      {/* Hero Section */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg,#0F766E,#14B8A6)",
          color: "white",
        }}
      >
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
        >
          Monitor attendance,
          payroll and workforce
          activity from one place.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            Attendance Rate:
            {" "}
            {stats.attendancePercentage}%
          </Typography>

          <Typography
            sx={{
              mt: 1,
              opacity: 0.9,
            }}
          >

            <Typography
  sx={{
    mt: 1,
    opacity: 0.8,
    fontSize: 13,
  }}
>
  Last Updated:
  {" "}
  {new Date().toLocaleString(
    "en-IN"
  )}
</Typography>
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </Typography>
        </Box>
      </Paper>

      {/* KPI Cards */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, 1fr)",
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
              borderTop:
                `4px solid ${card.color}`,
              borderLeft:
                "1px solid #E5E7EB",
              borderRight:
                "1px solid #E5E7EB",
              borderBottom:
                "1px solid #E5E7EB",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
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
                  color:
                    card.color,
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
            lg: "1fr 1fr",
          },
          gap: 3,
          mt: 4,
        }}
      >

        {/* Attendance Overview */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border:
              "1px solid #E5E7EB",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
            }}
          >
            Attendance Overview
          </Typography>

          <Typography
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            Attendance Rate:
            {" "}
            {stats.attendancePercentage}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={
              stats.attendancePercentage
            }
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 4,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                color:
                  "#16A34A",
              }}
            >
              Present
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {stats.presentToday}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
            }}
          >
            <Typography
              sx={{
                color:
                  "#DC2626",
              }}
            >
              Absent
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {stats.absentToday}
            </Typography>
          </Box>

        </Paper>

        {/* Quick Actions */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border:
              "1px solid #E5E7EB",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
            }}
          >
            Quick Actions
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  "/employees"
                )
              }
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >
              👤 Add Employee
            </Button>

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  "/attendance"
                )
              }
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >
              🕒 Attendance
            </Button>

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  "/payroll"
                )
              }
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >
              💰 Generate Payroll
            </Button>

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  "/salary-slips"
                )
              }
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >
              📄 Salary Slips
            </Button>

          </Box>
        </Paper>

        {/* Workforce Summary */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border:
              "1px solid #E5E7EB",
            gridColumn: {
              lg: "span 2",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
            }}
          >
            Workforce Summary
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(4,1fr)",
              },
              gap: 3,
            }}
          >

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Employees
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                {stats.totalEmployees}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Present
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color:
                    "#16A34A",
                }}
              >
                {stats.presentToday}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Absent
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color:
                    "#DC2626",
                }}
              >
                {stats.absentToday}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Payroll
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color:
                    "#7C3AED",
                }}
              >
                ₹
                {stats.monthlyPayroll.toLocaleString(
                  "en-IN"
                )}
              </Typography>
            </Box>

          </Box>

        </Paper>

      </Box>

    </AdminLayout>
  );
};

export default Dashboard;