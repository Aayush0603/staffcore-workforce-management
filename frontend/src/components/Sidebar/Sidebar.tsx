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

import LogoutIcon from "@mui/icons-material/Logout";

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
  borderRight:
    "1px solid #E5E7EB",
  backgroundColor:
    "#FFFFFF",
  display: "flex",
  flexDirection: "column",
},
      }}
    >
      <Box sx={{ height: 16 }} />
      <Box
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <GroupsIcon
  sx={{
    color: "#0F766E",
    fontSize: 32,
  }}
/>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0F766E",
            }}
          >
            StaffCore
          </Typography>
        </Box>

        <Typography
  variant="body2"
  sx={{
    color: "#6B7280",
    mt: 0.5,
    fontWeight: 500,
  }}
>
  Workforce Management System
</Typography>
      </Box>

<Divider sx={{ mb: 2 }} />

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() =>
              navigate(item.path)
            }
            selected={
              location.pathname ===
              item.path
            }
            sx={{
              mb: 1,
              borderRadius: 2,

              "&:hover": {
  backgroundColor: "#F8FAFC",
},

              "&.Mui-selected": {
  backgroundColor: "#E6FFFB",
  color: "#0F766E",
  borderLeft: "4px solid #0F766E",
  fontWeight: 600,


                "& .MuiListItemIcon-root":
                  {
                    color:
                      "#0F766E",
                  },
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
            />
          </ListItemButton>
        ))}
      </List>
     <Box sx={{ mt: "auto" }} />

<Divider />

<List sx={{ px: 1, py: 1 }}>
 <ListItemButton
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/");
  }}
  sx={{
    borderRadius: 2,

    "&:hover": {
      backgroundColor: "#FEF2F2",
    },
  }}
>
    <ListItemIcon>
      <LogoutIcon
        sx={{
          color: "#DC2626",
        }}
      />
    </ListItemIcon>

    <ListItemText
      primary="Logout"
      sx={{
        color: "#DC2626",
      }}
    />
  </ListItemButton>
</List>
    </Drawer>
  );
};

export default Sidebar;