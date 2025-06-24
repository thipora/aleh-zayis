import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: "#fdf9f3",
        minHeight: "100vh",
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#5d4037", fontWeight: 600 }}
      >
        {t("ManagerDashboard.title")}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8d6e63",
            "&:hover": { backgroundColor: "#795548" },
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
          onClick={() => navigate("/manager/employees")}
        >
          {t("ManagerDashboard.viewEmployees")}
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: "#8d6e63",
            color: "#5d4037",
            "&:hover": {
              backgroundColor: "#f0eae2",
              borderColor: "#795548",
            },
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
          onClick={() => navigate("/manager/reports")}
        >
          {t("ManagerDashboard.viewReports")}
        </Button>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
