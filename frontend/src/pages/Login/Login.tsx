import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0px) rotate(360deg); }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      // BYPASS BACKEND
      // const data = await loginUser(username, password);

      const data = { token: "fake-jwt-token-for-bypassing-backend" };
      
      // Simulate network delay for effect
      await new Promise(resolve => setTimeout(resolve, 800));

      login(data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // Deep dark mode gradient: dark green and dark blue mix
        background: "linear-gradient(-45deg, #022c22, #042f2e, #1e3a8a, #0b1329, #022c22)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 18s ease infinite`,
        position: "relative",
        overflow: "hidden",
        px: 2,
      }}
    >
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
        }
      `}</style>
      {/* Large glowing blob 1 */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: { xs: 300, md: 600 },
          height: { xs: 300, md: 600 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          animation: `${pulseGlow} 12s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />
      {/* Large glowing blob 2 */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: { xs: 350, md: 700 },
          height: { xs: 350, md: 700 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          animation: `${pulseGlow} 15s ease-in-out infinite reverse`,
          pointerEvents: "none",
        }}
      />

      {/* Floating Circle 1 (Green glowing glass circle) */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "15%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.08)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          boxShadow: "0 0 25px rgba(16, 185, 129, 0.2), inset 0 0 10px rgba(16, 185, 129, 0.1)",
          animation: `${floatAnimation} 14s ease-in-out infinite`,
          pointerEvents: "none",
          display: { xs: "none", sm: "block" },
        }}
      />
      {/* Floating Circle 2 (Blue glowing glass circle) */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.06)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(59, 130, 246, 0.15)",
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.15), inset 0 0 12px rgba(59, 130, 246, 0.08)",
          animation: `${floatAnimation} 18s ease-in-out infinite reverse`,
          pointerEvents: "none",
          display: { xs: "none", sm: "block" },
        }}
      />
      {/* Floating Circle 3 (Small emerald circle) */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          right: "8%",
          width: 45,
          height: 45,
          borderRadius: "50%",
          background: "rgba(52, 211, 153, 0.12)",
          border: "1px solid rgba(52, 211, 153, 0.25)",
          boxShadow: "0 0 18px rgba(52, 211, 153, 0.2)",
          animation: `${floatAnimation} 16s ease-in-out infinite 1s`,
          pointerEvents: "none",
          display: { xs: "none", md: "block" },
        }}
      />

      <Fade in={true} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: { xs: 4, md: 5 },
            borderRadius: 4,
            background: "rgba(15, 23, 42, 0.45)", // Semi-transparent slate-900 background
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: "20px",
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
                transform: "rotate(-5deg)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "rotate(0deg) scale(1.05)",
                  boxShadow: "0 14px 30px -5px rgba(16, 185, 129, 0.5)",
                },
              }}
            >
              <Box sx={{ transform: "rotate(5deg)", display: 'flex' }}>
                <PeopleAltIcon sx={{ color: "white", fontSize: 36 }} />
              </Box>
            </Box>
          </Box>

          {/* Branding */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            StaffCore
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "#94a3b8",
              mt: 1,
              mb: 4,
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            Welcome back to your workspace
          </Typography>

          {/* Error */}
          {error && (
            <Fade in={true}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  color: "#fecaca",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                  "& .MuiAlert-icon": { color: "#ef4444" }
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {/* Form Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)", "&.Mui-focused": { color: "#ffffff" } }}>
                Username
              </InputLabel>
              <OutlinedInput
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                  </InputAdornment>
                }
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  "& input": {
                    color: "#ffffff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.4)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffffff",
                    borderWidth: "2px",
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)", "&.Mui-focused": { color: "#ffffff" } }}>
                Password
              </InputLabel>
              <OutlinedInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        mr: 1,
                        "&:hover": { color: "#ffffff" }
                      }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                  "& input": {
                    color: "#ffffff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.4)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffffff",
                    borderWidth: "2px",
                  },
                }}
              />
            </FormControl>

            {/* Login Button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              disableElevation
              sx={{
                mt: 1.5,
                py: 1.6,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "0.95rem",
                letterSpacing: "0.5px",
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                boxShadow: "0 4px 20px 0 rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 24px rgba(16, 185, 129, 0.45)",
                  background: "linear-gradient(135deg, #059669, #2563eb)",
                },
                "&:active": {
                  transform: "translateY(1px)",
                  boxShadow: "0 2px 10px rgba(16, 185, 129, 0.2)",
                }
              }}
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;