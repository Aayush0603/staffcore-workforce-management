import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

  const { login } = useAuth();

  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {

      try {

        setError("");

        setLoading(true);

        const data =
          await loginUser(
            username,
            password
          );

        login(
          data.token
        );

        navigate(
          "/dashboard"
        );

      } catch (err: any) {

        setError(
          err?.response?.data
            ?.message ||
          "Invalid username or password"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0F766E,#14B8A6)",
        px: 2,
      }}
    >

      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 5,
          borderRadius: 4,
        }}
      >

        {/* Logo */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background:
                "#0F766E",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <PeopleAltIcon
              sx={{
                color: "white",
                fontSize: 38,
              }}
            />
          </Box>
        </Box>

        {/* Branding */}

        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            color: "#0F766E",
          }}
        >
          StaffCore
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "#6B7280",
            mt: 1,
            mb: 4,
          }}
        >
          Workforce Management System
        </Typography>

        {/* Error */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Username */}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        {/* Password */}

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {/* Login Button */}

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 2,
            backgroundColor:
              "#0F766E",

            "&:hover": {
              backgroundColor:
                "#115E59",
            },
          }}
          disabled={loading}
          onClick={handleLogin}
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </Button>

      </Paper>

    </Box>
  );
};

export default Login;