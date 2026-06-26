import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
const ExitIcon = (props: any) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <g className="exit-arrow" style={{ transition: "transform 0.2s ease-in-out" }}>
      <polyline points="12 8 8 12 12 16" />
      <line x1="16" y1="12" x2="8" y2="12" />
    </g>
  </svg>
);
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Employees",
      icon: <PeopleIcon />,
      path: "/employees",
    },
    {
      text: "Shift Management",
      icon: <ScheduleIcon />,
      path: "/shift-management",
    },
    {
      text: "Attendance Log",
      icon: <AccessTimeIcon />,
      path: "/attendance",
    },

    {
      text: "Monthly Attendance",
      icon: <AccessTimeIcon />,
      path: "/attendance/monthly",
    },
    {
      text: "Salary Structure",
      path: "/salary-structure",
      icon: <AccountBalanceWalletIcon />,
    },

    {
      text: "Payroll",
      icon: <PaymentsIcon />,
      path: "/payroll",
    },

    {
      text: "Salary Slips",
      icon: <DescriptionIcon />,
      path: "/salary-slips",
    },

    {
      text: "Organization Settings",
      icon: <SettingsIcon />,
      path: "/organization-settings",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(169, 180, 190, 0.8)", // Darker translucent grey for better glass contrast
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Disable scrollbar on the outer drawer container
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <GroupsIcon
            sx={{
              color: "#115e59", // Dark green
              fontSize: 28,
            }}
          />

          <Typography
            sx={{
              fontWeight: 750,
              fontSize: "1.2rem",
              color: "#115e59", // Dark green brand color
              letterSpacing: "-0.3px",
            }}
          >
            StaffCore
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "#6b7280", // Soft grey
            mt: 0.5,
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        >
          Workforce Management System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.08)", mb: 1, mx: 2 }} />

      <List
        sx={{
          px: 1,
          py: 0.5,
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                mb: 1.2,
                borderRadius: "12px",
                py: 1.1,
                px: 1.5,
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease-in-out",
                "& .MuiListItemIcon-root": {
                  color: isSelected ? "#ffffff" : "#4b5563",
                  minWidth: 36,
                  transition: "color 0.2s ease",
                },
                "& .MuiListItemText-primary": {
                  fontSize: "0.95rem",
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? "#ffffff" : "#4b5563",
                  transition: "color 0.2s ease",
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? "#ffffff" : "#111827",
                  },
                  "& .MuiListItemText-primary": {
                    color: isSelected ? "#ffffff" : "#111827",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(17, 94, 89, 0.85)", // Glassy dark green active background
                  border: "1px solid rgba(17, 94, 89, 0.3)",
                  boxShadow: "0 4px 16px rgba(17, 94, 89, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(17, 94, 89, 0.95)",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.08)" }} />

      <List
        sx={{
          px: 1,
          py: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ListItemButton
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          sx={{
            borderRadius: "12px",
            py: 1,
            px: 2,
            mx: 2,
            mb: 2,
            background: "rgba(239, 68, 68, 0.15)", // Red glass background
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(239, 68, 68, 0.3)", // Red glass border
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.05)",
            transition: "all 0.2s ease",
            "& .MuiListItemIcon-root": {
              minWidth: "auto",
              mr: 1.5,
              color: "#dc2626", // Red icon
            },
            "& .MuiListItemText-primary": {
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#dc2626", // Red text
            },
            "&:hover": {
              background: "rgba(239, 68, 68, 0.5)", // Bright red glass background on hover
              transform: "translateY(-2px)",
              boxShadow: "0 0 16px rgba(239, 68, 68, 0.5)", // Glowing red shadow
              border: "1px solid rgba(239, 68, 68, 0.8)", // Bright red glass border
              "& .MuiListItemIcon-root": {
                color: "#ffffff", // Pure white icon on hover
              },
              "& .MuiListItemText-primary": {
                color: "#ffffff", // Pure white text on hover
              },
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          <ListItemIcon>
            <ExitIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;