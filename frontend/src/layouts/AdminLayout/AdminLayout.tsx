import { Box } from "@mui/material";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ 
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f1f5f9 100%)",
    }}>

      <Navbar />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#F8FAFC",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          pt: "80px", // 64px navbar + 16px gap
          pb: 2,
          px: {
            xs: 2,
            sm: 3,
          },
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            maxWidth: "100%",
            mx: 0,
            width: "100%",
            minHeight: 0,
          }}
        >
          {children}
        </Box>
      </Box>

    </Box>
  );
};

export default AdminLayout;