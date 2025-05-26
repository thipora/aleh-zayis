import React, { useState } from "react";
import {
  TextField, Button, Typography, Box, Paper
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const api = new APIrequests();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.putRequest("/auth/forgot-password", { email });
      setMessage(t("forgot.success"));
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error(err);
      setError(t("forgot.error"));
    }

    setLoading(false);
  };

  //   return (
  //     <Box
  //       sx={{
  //         bgcolor: "#fdf9f3",
  //         minHeight: "calc(100vh - 300px)",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         px: 2,
  //         py: 4,
  //       }}
  //     >

  //       <Paper
  //         elevation={3}
  //         sx={{
  //           p: 5,
  //           borderRadius: 4,
  //           bgcolor: "#ffffff",
  //           boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  //           width: "100%",
  //           maxWidth: 420,
  //         }}
  //       >
  //         <Button
  //   onClick={() => navigate("/login")}
  //   sx={{
  //     mb: 2,
  //     textTransform: "none",
  //     color: "#5d4037",
  //     fontWeight: 500,
  //     fontSize: "0.9rem",
  //     '&:hover': { backgroundColor: "transparent", textDecoration: "underline" },
  //     alignSelf: "flex-start"
  //   }}
  //   startIcon={<span style={{ fontSize: "1rem" }}>←</span>}
  // >
  //   Back
  // </Button>

  //         <Typography variant="h4" align="center" sx={{ color: "#5d4037", fontWeight: 600, mb: 2 }}>
  //           {t("forgot.title")}
  //         </Typography>

  //         {message && (
  //           <Typography color="success.main" align="center" sx={{ mb: 1 }}>
  //             {message}
  //           </Typography>
  //         )}
  //         {error && (
  //           <Typography color="error" align="center" sx={{ mb: 1 }}>
  //             {error}
  //           </Typography>
  //         )}

  //         <form onSubmit={handleSubmit}>
  //           <TextField
  //             fullWidth
  //             label={t("forgot.email")}
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             margin="normal"
  //             required
  //           />

  //           <Button
  //             type="submit"
  //             variant="contained"
  //             fullWidth
  //             disabled={loading}
  //             sx={{
  //               mt: 3,
  //               backgroundColor: "#8d6e63",
  //               "&:hover": { backgroundColor: "#795548" },
  //               borderRadius: 3,
  //               py: 1.5,
  //               fontWeight: 600,
  //             }}
  //           >
  //             {t("forgot.submit")}
  //           </Button>
  //         </form>
  //       </Paper>
  //     </Box>
  //   );
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
        <Button
          onClick={() => navigate("/login")}
          sx={{
            mb: 2,
            textTransform: "none",
            color: "#5d4037",
            fontWeight: 500,
            fontSize: "0.9rem",
            '&:hover': { backgroundColor: "transparent", textDecoration: "underline" },
            alignSelf: "flex-start"
          }}
          startIcon={<span style={{ fontSize: "1rem" }}>←</span>}
        >
          {t("forgotPassword.back")}
        </Button>

        <Typography variant="h4" align="center" sx={{ color: "#5d4037", fontWeight: 600, mb: 2 }}>
          {t("forgotPassword.title")}
        </Typography>

        {message && (
          <Typography color="success.main" align="center" sx={{ mb: 1 }}>
            {t("forgotPassword.success")}
          </Typography>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ mb: 1 }}>
            {t("forgotPassword.error")}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t("forgotPassword.email")}
            placeholder={t("forgotPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: "#8d6e63",
              "&:hover": { backgroundColor: "#795548" },
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {t("forgotPassword.submit")}
          </Button>
        </form>
      </Paper>
    </Box>
  );

};

export default ForgotPassword;
