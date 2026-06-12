import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const data = await loginUser(
        username,
        password
      );

      login(data.token);

      navigate("/dashboard");
      

      alert("Login Successful");

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mt: 10,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
        >
          Hospital Login
        </Typography>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
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

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;