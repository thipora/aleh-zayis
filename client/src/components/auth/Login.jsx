import { useState, useEffect } from "react";
import {
  TextField, Button, Typography, Box,
  InputAdornment, IconButton, Paper
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const apiRequests = new APIrequests();

  const location = useLocation();

  useEffect(() => {
    const logout = async () => {
      try {
        await apiRequests.postRequest("/auth/logout");
      } catch (error) {
        console.error("Logout failed", error);
      }
      localStorage.removeItem("user");
    };

    logout();
  }, [location.key]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("login.error.requiredFields"));
      return;
    }

    try {
      const data = await apiRequests.postRequest("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      switch (data.user.account_type) {
        case "Employee":
          navigate("/employee");
          break;
        case "Manager":
          navigate("/manager");
          break;
        case "Client":
          navigate("/client");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError(t("login.error.failed"));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        bgcolor: "#fdf9f3",
        minHeight: "calc(100vh - 300px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: "#ffffff",
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Typography variant="h4" align="center" sx={{ color: "#5d4037", fontWeight: 600, mb: 2 }}>
          {t("login.title")}
        </Typography>

        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t("login.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            slotProps={{ input: { dir: "ltr" } }}
          />
          <TextField
            fullWidth
            label={t("login.password")}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#8d6e63",
              "&:hover": { backgroundColor: "#795548" },
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {t("login.submit")}
          </Button>

          <Typography
            variant="body2"
            align="right"
            sx={{ mt: 1, color: "#5d4037" }}
          >
            <a href="/password" style={{ textDecoration: "underline", color: "#5d4037" }}>
              {t("login.forgot")}
            </a>
          </Typography>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          {t("login.noAccount")}{" "}
          <a href="/register" style={{ color: "#5d4037", fontWeight: 500 }}>
            {t("login.signUp")}
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
