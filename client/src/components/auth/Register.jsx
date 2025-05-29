import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { APIrequests } from "../../APIrequests";
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiRequests = new APIrequests();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await apiRequests.postRequest("/auth/register", formData);
      setSuccessMsg(t("register.success"));
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError(err.response?.data?.message || t("register.error"));
    } finally {
      setLoading(false);
    }
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
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#5d4037", fontWeight: 600, mb: 2 }}
        >
          {t("register.title")}
        </Typography>

        {error && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        {successMsg && (
          <Typography color="primary" variant="body2" align="center" sx={{ mb: 1 }}>
            {successMsg}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t("register.name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label={t("register.email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            dir={i18n.language === "he" ? "rtl" : "ltr"}
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
            disabled={loading}
          >
            {loading ? t("register.loading") : t("register.submit")}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          {t("register.alreadyAccount")}{" "}
          <a href="/login" style={{ color: "#5d4037", fontWeight: 500 }}>
            {t("register.login")}
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
