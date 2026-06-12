import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";

import NotificationsNoneIcon
from "@mui/icons-material/NotificationsNone";

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "#ffffff",
        color: "#111827",

        width: {
          md: "calc(100% - 240px)",
          xs: "100%",
        },

        ml: {
          md: "240px",
          xs: 0,
        },

        borderBottom:
          "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
  minHeight: "64px",
}}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
  variant="h6"
  sx={{
    fontWeight: 700,
    color: "#0F766E",
  }}
>
  StaffCore
</Typography>

         <Typography
  variant="body2"
  sx={{
    color: "#6B7280",
    fontWeight: 500,
  }}
>
  Workforce Management System
</Typography>
        </Box>

        <IconButton
        onClick={() =>
  alert("No new notifications")
}
  sx={{
    border: "1px solid #E5E7EB",
    borderRadius: 2,
  }}
>
  <NotificationsNoneIcon />
</IconButton>

       <Box
  onClick={() =>
    alert("Profile menu coming soon")
  }
  sx={{
    display: "flex",
    alignItems: "center",
    ml: 2,
    gap: 1.5,
    cursor: "pointer",
    p: 1,
    borderRadius: 2,

    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  }}
>
  <Avatar
    sx={{
      bgcolor: "#0F766E",
      width: 40,
      height: 40,
    }}
  >
    A
  </Avatar>

  <Box>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      Admin
    </Typography>

    <Typography
      variant="caption"
      sx={{
        color: "#6B7280",
      }}
    >
      Administrator
    </Typography>
  </Box>
</Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;