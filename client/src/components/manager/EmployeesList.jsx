import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Box, Button, Table, TableHead, CircularProgress,
  TableBody, TableRow, TableCell, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { APIrequests } from "../../APIrequests";
import RateDialog from "./RateDialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EditIcon from '@mui/icons-material/Edit';

const EmployeeList = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [newEnglishName, setNewEnglishName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [nameError, setNameError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const navigate = useNavigate();
  const api = new APIrequests();
  const isHebrew = (text) => /[\u0590-\u05FF]/.test(text);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.getRequest("/employees");
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);


  const handleUpdateEnglishName = async () => {
    try {
      if (!newEnglishName.trim()) {
        setNameError(t("employeeList.errorEmptyName"));
        return;
      }

      await api.putRequest(`/users/${editingName.id_user}/name-en`, { en_name: newEnglishName });

      const updated = employees.map(emp =>
        emp.id_user === editingName.id_user ? { ...emp, name: newEnglishName } : emp
      );
      setEmployees(updated);
      setEditingName(null);
      setNewEnglishName("");
      setNameError("");
    } catch (err) {
      console.error("Failed to update English name", err);
      setNameError(t("employeeList.errorUpdateFailed"));
    }
  };


  const filteredEmployees = employees.filter(emp => {
    const matchName = emp.name.toLowerCase().includes(filterName.toLowerCase());
    const matchAvailability = filterAvailability ? emp.availability_status === filterAvailability : true;
    const matchRole = filterRole ? emp.roles.includes(filterRole) : true;
    return matchName && matchAvailability && matchRole;
  });

  const allRoles = [...new Set(employees.flatMap(emp => emp.roles))];

  const handleExportAllWork = async () => {
    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await api.getFile(`/reports/all-work-entries-excel`);
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "All_Work_Entries.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to export work entries", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("employeeList.title")}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleExportAllWork}
          disabled={isExporting}
          startIcon={isExporting && <CircularProgress size={16} color="inherit" />}
        >
          {isExporting ? t("employeeList.exporting") : t("employeeList.exportAll")}
        </Button>

        <TextField
          label={t("employeeList.searchName")}
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t("availability.availability")}</InputLabel>
          <Select
            value={filterAvailability}
            label={t("availability.availability")}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <MenuItem value="">{t("availability.all")}</MenuItem>
            <MenuItem value="available">{t("availability.available")}</MenuItem>
            <MenuItem value="partial">{t("availability.partial")}</MenuItem>
            <MenuItem value="not_available">{t("availability.notAvailable")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t("employeeList.role")}</InputLabel>
          <Select
            value={filterRole}
            label={t("employeeList.role")}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <MenuItem value="">{t("employeeList.all")}</MenuItem>
            {allRoles.map((role, i) => (
              <MenuItem key={i} value={role}>{t(`roles.${role}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ mb: 4, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("employeeList.name")}</TableCell>
              <TableCell>{t("availability.availabilityStatus")}</TableCell>
              <TableCell>{t("employeeList.email")}</TableCell>
              <TableCell>{t("employeeList.roles")}</TableCell>
              <TableCell align="center">{t("employeeList.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map(emp => (
              <TableRow key={emp.id_employee}>
                <TableCell>
                  {emp.name}
                  {isHebrew(emp.name) && (
                    <Tooltip title={t("employeeList.editEnglishName")}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingName(emp);
                          setNewEnglishName(emp.en_name || "");
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{t(`availability.${emp.availability_status}`)}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.roles.map((role, i) => t(`roles.${role}`)).join(",  ")}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      navigate(`/manager/employee/${emp.id_employee}/work`, {
                        state: { name: emp.name },
                      })
                    }
                  >
                    {t("employeeList.viewWork")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setOpenRateDialog(true);
                    }}
                  >
                    {t("employeeList.editRates")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {selectedEmployee && (
        <RateDialog
          open={openRateDialog}
          onClose={() => setOpenRateDialog(false)}
          employeeId={selectedEmployee.id_employee}
          employeeName={selectedEmployee.name}
        />
      )}

      <Dialog open={!!editingName} onClose={() => setEditingName(null)}>
        <DialogTitle>{t("employeeList.editEnglishName")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("employeeList.englishName")}
            value={newEnglishName}
            onChange={(e) => {
              setNewEnglishName(e.target.value);
              setNameError("");
            }}
            fullWidth
            error={!!nameError}
            helperText={nameError}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingName(null)}>{t("cancel")}</Button>
          <Button onClick={handleUpdateEnglishName} variant="contained">{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeList;