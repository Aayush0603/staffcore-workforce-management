import { Box } from "@mui/material";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
  <Box sx={{ display: "flex" }}>

    <Navbar />

    <Sidebar />

    <Box
  component="main"
  sx={{
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    minHeight: "calc(100vh - 64px)",

        px: {
          xs: 1,
          sm: 2,
          md: 2,
        },

        py: {
          xs: 2,
          sm: 3,
        },
      }}
    >

      <Box
  sx={{
    pt: 4,
    maxWidth: "100%",
    mx: 0,
    width: "100%",
  }}
>
        {children}
      </Box>
    </Box>

  </Box>
);
};

export default AdminLayout;