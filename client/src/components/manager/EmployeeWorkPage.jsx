import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Typography, CircularProgress, Box, Button } from "@mui/material";
import { APIrequests } from "../../APIrequests";
import WorkEntries from "../WorkEntries/WorkEntries";

const EmployeeWorkPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Work Entries – {state?.name || "Employee"}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <WorkEntries workEntries={entries} allowUpdate={false} />
      )}
    </Box>
  );
};

export default EmployeeWorkPage;
