import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";

const EmployeeWorkPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const api = new APIrequests();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await api.getRequest(`/workEntries/${id}`);
        setEntries(data);
      } catch (error) {
        console.error("Error fetching work entries:", error);
      }
      setLoading(false);
    };

    fetchEntries();
  }, [id]);

  return (
    <Box
      sx={{
        bgcolor: "#fdf9f3",
        minHeight: "100vh",
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 5 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#5d4037", fontWeight: 600 }}
      >
        {t("workEntries.workEntries")} – {state?.name || "Employee"}

      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <WorkEntries workEntries={entries} allowUpdate={false} />
      )}
    </Box>
  );
};

export default EmployeeWorkPage;
