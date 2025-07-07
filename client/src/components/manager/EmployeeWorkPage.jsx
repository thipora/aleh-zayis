import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import { useTranslation } from "react-i18next";
import WorkEntries from "../workEntries/WorkEntries";
import MonthSelector from "../common/MonthSelector";

const EmployeeWorkPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(null);
  const { t } = useTranslation();
  const api = new APIrequests();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const fetchEntries = async (selectedMonth, selectedYear) => {
    setLoading(true);
    try {
      const url = `/workEntries/${id}?month=${selectedMonth}&year=${selectedYear}`;
      const data = await api.getRequest(url);
      setEntries(data.entries);
      setCurrency(data.currency);
    } catch (error) {
      console.error("Error fetching work entries:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries(month, year);
  }, [id, month, year]);

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

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <MonthSelector
          month={month}
          year={year}
          onChange={(newMonth, newYear) => {
            setMonth(newMonth);
            setYear(newYear);
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <WorkEntries
          workEntries={entries}
          onUpdate={setEntries}
          allowUpdate={false}
          allowDelete={true}
          month={month}
          year={year}
          employeeName={state?.name}
          onMonthChange={(newMonth, newYear) => {
            setMonth(newMonth);
            setYear(newYear);
          }}
          currency={currency}
        />
      )}
    </Box>
  );
};

export default EmployeeWorkPage;
